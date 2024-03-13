const handelDataFetchCheckout = async (path, method, body) => { // callback function for animation
    // attaching the backend api url to frontend
    const apiUrl = process.env.REACT_APP_API_URL_BACKEND + path;

    try {
        const res = await fetch(apiUrl, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            credentials: 'include',
            body: body === null ? null : JSON.stringify(body)
        });

        return await res.json();

    } catch (error) {
        console.log(error);
    }
}

export default handelDataFetchCheckout;