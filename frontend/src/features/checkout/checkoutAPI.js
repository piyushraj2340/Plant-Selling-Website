import { addRefreshSubscriber, getIsRefreshing, handelRefreshToken, onTokenRefresh, setIsRefreshing } from "../../utils/handelDataFetch";
import localStorageUtil from "../../utils/localStorage";

const handelRetryRequest = async (path, method, body, token) => {
    const apiUrl = process.env.REACT_APP_API_URL_BACKEND + path;

    const orderToken = localStorageUtil.getData("orderToken");

    try {
        const res = await fetch(apiUrl, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token} orderToken ${orderToken}`,
                Accept: "application/json",
            },
            body: body ? JSON.stringify(body) : null
        });

        return await res.json();
    }
    catch (error) {
        console.log(error);
    }
}

const handelDataFetchCheckout = async (path, method, body) => { // callback function for animation
    // attaching the backend api url to frontend
    const apiUrl = process.env.REACT_APP_API_URL_BACKEND + path;

    const accessToken = localStorageUtil.getData("accessToken");
    const orderToken = localStorageUtil.getData("orderToken");

    try {
        const res = await fetch(apiUrl, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken} orderToken ${orderToken}`,
                Accept: "application/json",
            },
            body: body ? JSON.stringify(body) : null
        });

        const data = await res.json();

        // Handle Token Expiry
        if (data.code === 'TOKEN_EXPIRED' || res.status === 401) {
            console.warn("Access token expired. Attempting to refresh...");

            // If a refresh is already in progress, queue this request
            if (getIsRefreshing()) {
                const retryRequest = await new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        resolve(handelRetryRequest(path, method, body, newToken.accessToken));
                    });
                });

                return await retryRequest;
            }

            setIsRefreshing(true);

            try {

                const newTokens = await handelRefreshToken();
                setIsRefreshing(false);

                // Notify all queued requests about the new access token
                onTokenRefresh(newTokens.accessToken);

                // Retry the original request with the new access token
                const resRetry = await handelRetryRequest(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/plants`, "POST", body, newTokens.accessToken);

                return await resRetry;
                
            } catch (error) {
                setIsRefreshing(false);
                throw error; // Handle token refresh failure (e.g., redirect to login)
            }
        }

        return data;

    } catch (error) {
        console.log(error);
    }
}

export default handelDataFetchCheckout;