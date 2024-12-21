import { addRefreshSubscriber, handelRefreshToken, setIsRefreshing, getIsRefreshing, onTokenRefresh } from "../../utils/handelDataFetch";
import localStorageUtil from "../../utils/localStorage";


// Function to retry the original request with the new token
const handelRetryRequest = async (url, method, body, token) => {
    const response = await fetch(url, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body
    });

    const data = await response.json();

    if (response.ok && data.status) {
        return data;
    } else {
        throw new Error(data.message || "Retry request failed.");
    }
};

export function handelImageUploadNurseryHeader(image) {
    return new Promise(async (resolve, rejected) => {
        const accessToken = localStorageUtil.getData("accessToken");
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/profile/images`, {
                method: "POST",
                body: image,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            const data = await response.json();

            if (data.code === 'TOKEN_EXPIRED' || response.status === 401) {
                console.warn("Access token expired. Attempting to refresh...");

                // If a refresh is already in progress, queue this request
                if (getIsRefreshing()) {
                    const retryRequest = await new Promise((resolve) => {
                        addRefreshSubscriber((newToken) => {
                            resolve(handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/profile/images`, "POST", image, newToken));
                        });
                    });

                    if (retryRequest.status) {
                        return resolve({ data: retryRequest })
                    } else {
                        const error = new Error(retryRequest.message);
                        return rejected(error)
                    }
                }

                setIsRefreshing(true);

                try {

                    const newTokens = await handelRefreshToken();
                    setIsRefreshing(false);

                    // Notify all queued requests about the new access token
                    onTokenRefresh(newTokens.accessToken);

                    // Retry the original request with the new access token
                    const resRetry = await handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/profile/images`, "POST", image, newTokens.accessToken);

                    if (resRetry.status) {
                        return resolve({ data: resRetry })
                    } else {
                        const error = new Error(resRetry.message);
                        return rejected(error)
                    }

                } catch (error) {
                    setIsRefreshing(false);
                    throw error; // Handle token refresh failure (e.g., redirect to login)
                }
            }

            if (data.status) {
                resolve({ data })
            } else {
                const error = new Error(data.message);
                error.statusCode = data.status;
                rejected(error);
            }
        } catch (error) {
            console.log(error);
            
            error.statusCode = false;
            rejected(error);
        }
    }
    );
}

export function handelImageUploadNurseryStore(imageId, body) {
    return new Promise(async (resolve, rejected) => {
        const accessToken = localStorageUtil.getData("accessToken");
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/store/images/${imageId}`, {
                method: "POST",
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();

            if (data.code === 'TOKEN_EXPIRED' || response.status === 401) {
                console.warn("Access token expired. Attempting to refresh...");

                // If a refresh is already in progress, queue this request
                if (getIsRefreshing()) {
                    const retryRequest = await new Promise((resolve) => {
                        addRefreshSubscriber((newToken) => {
                            resolve(handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/store/images/${imageId}`, "POST", body, newToken.accessToken));
                        });
                    });

                    if (retryRequest.status) {
                        return resolve({ data: retryRequest })
                    } else {
                        const error = new Error(retryRequest.message);
                        return rejected(error)
                    }
                }

                setIsRefreshing(true);

                try {

                    const newTokens = await handelRefreshToken();
                    setIsRefreshing(false);

                    // Notify all queued requests about the new access token
                    onTokenRefresh(newTokens.accessToken);

                    // Retry the original request with the new access token
                    const resRetry = await handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/store/images/${imageId}`, "POST", body, newTokens.accessToken);

                    if (resRetry.status) {
                        return resolve({ data: resRetry })
                    } else {
                        const error = new Error(resRetry.message);
                        return rejected(error)
                    }

                } catch (error) {
                    setIsRefreshing(false);
                    throw error; // Handle token refresh failure (e.g., redirect to login)
                }
            }

            if (data.status) {
                resolve({ data })
            } else {
                const error = new Error(data.message);
                error.statusCode = data.status;
                rejected(error);
            }
        } catch (error) {
            error.statusCode = false;
            rejected(error);
        }
    }
    );
}

export function handelAddNewPlantToNursery(body) {
    return new Promise(async (resolve, rejected) => {
        try {
            const accessToken = localStorageUtil.getData("accessToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/plants`, {
                method: "POST",
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();

            if (data.code === 'TOKEN_EXPIRED' || response.status === 401) {
                console.warn("Access token expired. Attempting to refresh...");

                // If a refresh is already in progress, queue this request
                if (getIsRefreshing()) {
                    const retryRequest = await new Promise((resolve) => {
                        addRefreshSubscriber((newToken) => {
                            resolve(handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/plants`, "POST", body, newToken.accessToken));
                        });
                    });

                    if (retryRequest.status) {
                        return resolve({ data: retryRequest })
                    } else {
                        const error = new Error(retryRequest.message);
                        return rejected(error)
                    }
                }

                setIsRefreshing(true);

                try {

                    const newTokens = await handelRefreshToken();
                    setIsRefreshing(false);

                    // Notify all queued requests about the new access token
                    onTokenRefresh(newTokens.accessToken);

                    // Retry the original request with the new access token
                    const resRetry = await handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/plants`, "POST", body, newTokens.accessToken);

                    if (resRetry.status) {
                        return resolve({ data: resRetry })
                    } else {
                        const error = new Error(resRetry.message);
                        return rejected(error)
                    }

                } catch (error) {
                    setIsRefreshing(false);
                    throw error; // Handle token refresh failure (e.g., redirect to login)
                }
            }

            if (data.status) {
                resolve({ data })
            } else {
                const error = new Error(data.message);
                error.statusCode = data.status;
                rejected(error);
            }
        } catch (error) {
            error.statusCode = false;
            rejected(error);
        }
    }
    );
}


export function handelFetchDataWithImages(url, method, body) {

    return new Promise(async (resolve, rejected) => {
        const accessToken = localStorageUtil.getData("accessToken");
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}${url}`, {
                method,
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();

            if (data.code === 'TOKEN_EXPIRED' || response.status === 401) {
                console.warn("Access token expired. Attempting to refresh...");

                // If a refresh is already in progress, queue this request
                if (getIsRefreshing()) {
                    const retryRequest = await new Promise((resolve) => {
                        addRefreshSubscriber((newToken) => {
                            resolve(handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}${url}`, method, body, newToken.accessToken));
                        });
                    });

                    if (retryRequest.status) {
                        return resolve({ data: retryRequest })
                    } else {
                        const error = new Error(retryRequest.message);
                        return rejected(error)
                    }
                }

                setIsRefreshing(true);

                try {

                    const newTokens = await handelRefreshToken();
                    setIsRefreshing(false);

                    // Notify all queued requests about the new access token
                    onTokenRefresh(newTokens.accessToken);

                    // Retry the original request with the new access token
                    const resRetry = await handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/plants`, "POST", body, newTokens.accessToken);

                    if (resRetry.status) {
                        return resolve({ data: resRetry })
                    } else {
                        const error = new Error(resRetry.message);
                        return rejected(error)
                    }

                } catch (error) {
                    setIsRefreshing(false);
                    throw error; // Handle token refresh failure (e.g., redirect to login)
                }
            }

            if (data.status) {
                resolve({ data })
            } else {
                const error = new Error(data.message);
                error.statusCode = data.status;
                rejected(error);
            }
        } catch (error) {
            error.statusCode = false;
            rejected(error);
        }
    }
    );
}