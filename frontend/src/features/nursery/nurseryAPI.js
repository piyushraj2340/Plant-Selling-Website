export function handelImageUploadNurseryHeader(image) {
    return new Promise(async (resolve, rejected) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/profile/images`, {
                method: "POST",
                body: image,
                credentials: 'include'
            });
            const data = await response.json();

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

export function handelImageUploadNurseryStore(imageId, body) {
    return new Promise(async (resolve, rejected) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/store/images/${imageId}`, {
                method: "POST",
                body,
                credentials: 'include'
            });
            const data = await response.json();

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
            const response = await fetch(`${process.env.REACT_APP_API_URL_BACKEND}/api/v2/nursery/plants`, {
                method: "POST",
                body,
                credentials: 'include'
            });
            const data = await response.json();

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