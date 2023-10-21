const cloudinary = require('./cloudinary');

const uploadImages = async (images,options) => {
    try {
        const uploadedImages = [];

        for (const image of images) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, options);
            console.log(result);
            uploadedImages.push(result);
        }

        if (uploadedImages.length == 1) return uploadedImages[0];

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