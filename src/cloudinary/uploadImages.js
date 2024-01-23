const cloudinary = require('./cloudinary');

const uploadImages = async (images,options) => {
    try {
        const uploadedImages = [];

        for (const image of images) {
            if(image) {
                const result = await cloudinary.uploader.upload(image.tempFilePath, options);
                uploadedImages.push(result);
            }
        }

        return uploadedImages;
    } catch (error) {
        console.log(error);
    }
}

const uploadImage = async (image,options) => {
    try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, options);
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { uploadImages, uploadImage };