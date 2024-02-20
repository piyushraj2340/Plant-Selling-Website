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
        return await cloudinary.uploader.upload(image.tempFilePath, options);
    } catch (error) {
        console.log(error);
    }
}

const deleteImages = async (images, options) => {
    try {
        return await cloudinary.api.delete_resources(images, options);
    } catch (error) {
        console.log(error);
    }
}

const deleteFolder = async (path) => {
    try {
        return await cloudinary.api.delete_folder(path);
    } catch (error) {
        console.log(error);
    }
}

const deleteResourcesByPrefix = async (prefix, options) => {
    try {
        return await cloudinary.api.delete_resources_by_prefix(prefix, options);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { uploadImages, uploadImage, deleteImages, deleteFolder, deleteResourcesByPrefix };