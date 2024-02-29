const handelDataFetch = async ({ path, method, body = null }, setShowAnimation) => { // callback function for animation
    // attaching the backend api url to frontend
    const apiUrl = process.env.REACT_APP_API_URL_BACKEND + path;

    try {
        setShowAnimation({ type: "ANIMATION", showAnimation: true }); // callback function for animation
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
    } finally {
        setShowAnimation({ type: "ANIMATION", showAnimation: false }); // callback function for animation
    }
}

export default handelDataFetch;