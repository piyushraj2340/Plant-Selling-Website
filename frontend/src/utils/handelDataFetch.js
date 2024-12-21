import localStorageUtil from "./localStorage";

let isRefreshing = false; // Lock to prevent multiple refresh requests
export let refreshSubscribers = []; // Queue to store API calls waiting for new token

export const getIsRefreshing = () => isRefreshing;
export const setIsRefreshing = (value) => { isRefreshing = value; };

// Function to notify all subscribers waiting for the new token
export const onTokenRefresh = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = []; // Clear the queue after notifying
}

// Function to add a subscriber to the queue
export const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Function to refresh tokens
export const handelRefreshToken = async () => {
    const refreshToken = localStorageUtil.getData("refreshToken");
    if (!refreshToken) {
        throw new Error("Refresh token missing. Please log in again.");
    }

    const response = await fetch(
        process.env.REACT_APP_API_URL_BACKEND + "/api/v2/auth/refresh-token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        }
    );

    const data = await response.json();

    // Remove the token from the local storage...
    if (response.status === 403 && !data.status) {
        localStorageUtil.removeData("accessToken");
        localStorageUtil.removeData("refreshToken");
        localStorageUtil.removeData("orderToken");

        throw new Error(data.message || "Authentication Failed!");
    }


    if (response.ok && data.status) {
        // Save new tokens
        const { accessToken, refreshToken: newRefreshToken } = data.token;
        localStorageUtil.setData("accessToken", accessToken);
        localStorageUtil.setData("refreshToken", newRefreshToken);
        return { accessToken, newRefreshToken };
    } else {
        throw new Error(data.message || "Token refresh failed.");
    }
};



// Function to retry the original request with the new token
const handelRetryRequest = async (url, method, body, token) => {
    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (response.ok && data.status) {
        return data;
    } else {
        throw new Error(data.message || "Retry request failed.");
    }
};


const handelDataFetch = async (path, method, body) => {
    return new Promise(
        async (resolve, rejected) => {
            try {
                // attaching the backend api url to frontend
                const apiUrl = process.env.REACT_APP_API_URL_BACKEND + path;

                const accessToken = localStorageUtil.getData("accessToken");
                const orderToken = localStorageUtil.getData("orderToken");

                let bearer = `Bearer ${accessToken}`;

                if(path.startsWith("/api/v2/checkout") || orderToken) {
                    bearer = `Bearer ${accessToken} orderToken ${orderToken}`;
                }

                const res = await fetch(apiUrl, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${accessToken}`,
                        Authorization: bearer,
                        Accept: "application/json",
                    },
                    credentials: 'include',
                    body: body ? JSON.stringify(body) : null
                });

                const data = await res.json();

                // Handle Token Expiry
                if (data.code === 'TOKEN_EXPIRED' || res.status === 401) {
                    console.warn("Access token expired. Attempting to refresh...");

                    // If a refresh is already in progress, queue this request
                    if (isRefreshing) {
                        const retryRequest = await new Promise((resolve) => {
                            addRefreshSubscriber((newToken) => {
                                resolve(handelRetryRequest(apiUrl, method, body, newToken));
                            });
                        });

                        if (retryRequest.status) {
                            return resolve({ data: retryRequest })
                        } else {
                            const error = new Error(retryRequest.message);
                            return rejected(error)
                        }
                    }

                    isRefreshing = true;

                    try {

                        const newTokens = await handelRefreshToken();
                        isRefreshing = false;

                        // Notify all queued requests about the new access token
                        onTokenRefresh(newTokens.accessToken);

                        // Retry the original request with the new access token
                        const resRetry = await handelRetryRequest(apiUrl, method, body, newTokens.accessToken);

                        if (resRetry.status) {
                            return resolve({ data: resRetry })
                        } else {
                            const error = new Error(resRetry.message);
                            return rejected(error)
                        }

                    } catch (error) {
                        isRefreshing = false;
                        throw error; // Handle token refresh failure (e.g., redirect to login)
                    }
                }

                if (data.status) {
                    resolve({ data })
                } else {
                    const error = new Error(data.message);
                    rejected(error)
                }
            } catch (error) {
                console.error("Error during API request:", error);
                rejected(error)
            }
        }
    )
}

export default handelDataFetch;