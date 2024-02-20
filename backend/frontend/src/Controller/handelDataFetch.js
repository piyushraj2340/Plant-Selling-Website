const handelDataFetch = async ({path, method, body = null}, callback) => {
    try {
        callback(true);
        const res = await fetch(path, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: body === null ? null : JSON.stringify(body)
        });

        return await res.json();

    } catch (error) {
        console.log(error);
    } finally {
        callback(false);
    }
}

export default handelDataFetch;