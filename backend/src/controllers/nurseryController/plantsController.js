const { uploadImages, deleteResourcesByPrefix, deleteFolder } = require('../../utils/uploadImages');
const queryHelper = require('../../utils/queryHelper');
const plantsModel = require('../../model/nurseryModel/plants');
const { default: mongoose } = require('mongoose');

const sanitizeHtml = require('sanitize-html');
const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height']
    },
    allowedSchemes: ['http', 'https']
};

exports.addNewPlant = async (req, res, next) => {
    try {
        const { user, role, nursery, body, files } = req;

        if (body.description) {
            body.description = sanitizeHtml(body.description, sanitizeOptions);
        }

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }
        
        const images = [files?.image_0, files?.image_1, files?.image_2].filter(Boolean);
        
        const plant = new plantsModel(body);

        if (body.descriptionImagesUrls) {
            try {
                plant.descriptionImages = JSON.parse(body.descriptionImagesUrls);
            } catch (e) {
                console.error("Failed to parse descriptionImagesUrls", e);
            }
        }

        if (images.length > 0) {
            const resultImage = await uploadImages(images, {
                folder: `PlantSeller/user//nursery//plants/`,
                width: 550,
                height: 650,
                crop: "fit"
            });

            plant.images = resultImage.map((elem) => ({
                public_id: elem.public_id,
                url: elem.secure_url
            }));

            plant.imageList = resultImage.map((elem) => ({
                public_id: elem.public_id,
                url: elem.url
            }));
        }

        await plant.save();

        const info = {
            status: true,
            message: "New plant added successfully.",
        };

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

exports.getAllPlantsOfNursery = async (req, res, next) => {
    try {
        const { user, role, nursery } = req;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const { limit, skip, search, sort } = queryHelper.getQueryOptions(req);
        
        let query = { user, nursery };
        
        if (search) {
            query.$or = [
                { plantName: { $regex: search, $options: 'i' } }
            ];
        }

        if (req.query.filters) {
            try {
                const filters = JSON.parse(req.query.filters);
                if (filters.category && filters.category.length > 0) {
                    query.category = { $in: filters.category };
                }
                if (filters.status && filters.status.length > 0) {
                    query.status = { $in: filters.status };
                }
            } catch (err) {
                console.log("Error parsing filters", err);
            }
        }

        const result = await plantsModel.find(query).populate('category').sort(sort).skip(skip).limit(limit);
        const count = await plantsModel.countDocuments(query);

        if (!result) {
            const error = new Error("No Plants Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Plants Found successfully.",
            result,
            count
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

exports.getPlantById = async (req, res, next) => {
    try {
        const { user, role, nursery } = req;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const result = await plantsModel.findOne({ user, nursery, _id }).populate('category');

        if (!result) {
            const error = new Error("No Plant Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Plant Found successfully.",
            result
        };

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

exports.updatePlantById = async (req, res, next) => {
    try {
        const { user, nursery, role, body, files } = req;

        if (body.description) {
            body.description = sanitizeHtml(body.description, sanitizeOptions);
        }

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        
        let updateData = { ...req.body };
        const plant = await plantsModel.findOne({ user, nursery, _id });

        if (!plant) {
            const error = new Error("No Plant Found.");
            error.statusCode = 404;
            throw error;
        }

        if (body.descriptionImagesUrls) {
            try {
                updateData.descriptionImages = JSON.parse(body.descriptionImagesUrls);
            } catch (e) {
                console.error("Failed to parse descriptionImagesUrls", e);
            }
        }

        if (files) {
            const imagesRaw = [files.image_0, files.image_1, files.image_2].filter(Boolean);

            if (imagesRaw.length > 0) {
                const resultImage = await uploadImages(imagesRaw, {
                    folder: `PlantSeller/user//nursery//plants/`,
                    width: 550,
                    height: 650,
                    crop: "fit"
                });
                
                const newImages = resultImage.map((elem) => ({
                    public_id: elem.public_id,
                    url: elem.secure_url
                }));
                
                updateData.images = [...(plant.images || []), ...newImages];
                updateData.imageList = [...(plant.imageList || []), ...newImages.map(img => ({ public_id: img.public_id, url: img.url }))];
            }
        }

        const result = await plantsModel.findOneAndUpdate({ user, nursery, _id }, updateData, {
            new: true
        });

        const info = {
            status: true,
            message: "Plant updated successfully.",
            result
        };

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

exports.deletePlantById = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user, role, nursery } = req;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const result = await plantsModel.findOneAndDelete({ user, nursery, _id }, { session });

        if (!result) {
            const error = new Error("No Plant Found.");
            error.statusCode = 404;
            throw error;
        }

        await deleteResourcesByPrefix(`PlantSeller/user//nursery//plants/`, {
            type: 'upload',
            resource_type: 'image',
            invalidate: true
        });

        await deleteFolder(`PlantSeller/user//nursery//plants/`);

        await session.commitTransaction();

        const info = {
            status: true,
            message: "Plant deleted successfully.",
        };

        res.status(200).send(info);


    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }
};

exports.uploadDescriptionImage = async (req, res, next) => {
    try {
        const { user, role, nursery, params, files } = req;
        const { id } = params;

        if (!nursery || !role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        if (!files || !files.image) {
            const error = new Error("No image file uploaded");
            error.statusCode = 400;
            throw error;
        }

        const { uploadImage } = require('../../utils/uploadImages');

        const resultImage = await uploadImage(files.image, {
            folder: `PlantSeller/user//nursery//plants//descriptions`,
            crop: "scale"
        });

        if (!resultImage || !resultImage.secure_url) {
            const error = new Error("Failed to upload image");
            error.statusCode = 500;
            throw error;
        }

        res.status(200).send({
            status: true,
            message: "Description image uploaded successfully",
            url: resultImage.secure_url
        });
    } catch (error) {
        next(error);
    }
};
