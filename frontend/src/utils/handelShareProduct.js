const handelShareProduct = async (data, message) => {
    if(navigator.share) {
        try {
            await navigator.share(data);
        } catch (error) {
            console.log(error);
            message.error(error);
        }
    } else {
        message.error("Web Share API is not supported.")
    }
}


export default handelShareProduct;