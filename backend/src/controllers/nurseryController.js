const mongoose = require('mongoose');
const userModel = require('../model/user');
const nurseryModel = require('../model/nursery');
const plantModel = require('../model/plants');
const nurseryStores = require('../model/nurseryStore');
const { deleteFolder, deleteResourcesByPrefix, uploadImage } = require('../utils/uploadImages');

exports.createNurseryProfile = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        if (req.nursery || req.role.includes('seller')) {
            const error = new Error("Nursery already registered");
            error.statusCode = 403;
            throw error;
        }

        const addNursery = new nurseryModel(req.body);
        const updateUserRole = await userModel.findByIdAndUpdate({ _id: req.user }, {
            $push: {
                role: "seller"
            }
        }, {
            new: true,
            session
        });

        if (!updateUserRole && !updateUserRole.role.includes("seller")) {
            const error = new Error("Nursery Listed Failure");
            error.statusCode = 400;
            throw error;
        }

        await addNursery.save({ session });
        await session.commitTransaction();

        const info = {
            status: true,
            message: "Nursery Listed Successfully.",
            result: addNursery
        };

        res.status(200).send(info);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }
};

exports.getNurseryDetail = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 401;
            throw error;
        }

        const result = await nurseryModel.findOne({ user: req.user, _id: req.nursery }).select("-avatarList -coverList");

        if (!result) {
            const error = new Error("Nursery detail not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Nursery detail retrieved.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

exports.updateNurseryDetail = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 401;
            throw error;
        }

        if(req.body.nurseryEmail || req.body.nurseryPhone || req.body.nurseryOwnerName) {
            const error = new Error("You Are Not Allowed to edit this field");
            error.statusCode = 403;
            throw error;
        }

        const result = await nurseryModel.findOneAndUpdate({ user: req.user, _id: req.nursery }, req.body, {
            new: true
        });

        if (!result) {
            const error = new Error("Nursery detail not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Nursery detail Updated.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

exports.deleteNurseryDetail = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        if (!req.role.includes("seller") || !req.nursery) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 401;
            throw error;
        }

        const result = await nurseryModel.findOneAndDelete({ _id: req.nursery, user: req.user }, { session });

        if (!result) {
            const error = new Error("Nursery detail not found.");
            error.statusCode = 404;
            throw error;
        }

        const revokeUserRole = await userModel.findByIdAndUpdate({ _id: req.user }, {
            $pull: {
                role: 'seller'
            }
        }, {
            new: true,
            session
        });

        if (!revokeUserRole || revokeUserRole.role.includes("seller")) {
            const error = new Error("Nursery deleted failed.");
            error.statusCode = 400;
            throw error;
        }

        const deleteAllPlants = await plantModel.deleteMany({ user: req.user, nursery: req.nursery }, { session });
        const deleteNurseryStore = await nurseryStores.deleteMany({ user: req.user, nursery: req.nursery }, { session });

        if (!deleteAllPlants || !deleteNurseryStore) {
            const error = new Error("Nursery deleted failed.");
            error.statusCode = 400;
            throw error;
        }

        await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery`, {
            type: 'upload',
            resource_type: 'image',
            invalidate: true
        })

        await deleteFolder(`PlantSeller/user/${req.user}/nursery`);

        await session.commitTransaction();

        const info = {
            status: true,
            message: "Nursery deleted successfully.",
        };

        res.status(200).send(info);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        await session.endSession();
    }
};

exports.uploadNurseryImage = async (req, res, next) => {
    try {
        if (!req.role.includes("seller") || !req.nursery) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 401;
            throw error;
        }

        if (!req.files) {
            const error = new Error("Invalid Images to upload.");
            error.statusCode = 400;
            throw error;
        }

        let image;
        if (req.body.type === "avatar") {
            image = req.files.avatar;
        } else if (req.body.type === "cover") {
            image = req.files.cover;
        } else {
            const error = new Error("Invalid File Upload.");
            error.statusCode = 400;
            throw error;
        }

        const upload = await uploadImage(image, {
            folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/${req.body.type}`,
            tags: req.body.type,
        });

        const { public_id, secure_url } = upload;

        image = {
            public_id,
            url: secure_url
        }

        const result = await nurseryModel.findOneAndUpdate({ user: req.user }, {
            $set: {
                [req.body.type]: image
            },
            $push: {
                [req.body.type + "List"]: image
            }
        }, {
            new: true
        });

        if (!result) {
            const error = new Error("Failed to update image.");
            error.statusCode = 400;
            throw error;
        }

        const info = {
            status: true,
            message: "Image updated successfully.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

// todo: need to test this 
exports.getNurseryImages = async (req, res, next) => {
    try {
        if (!req.role.includes("seller") || !req.nursery) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 401;
            throw error;
        }

        const result = await nurseryModel.findOne({ user: req.user, _id: req.nursery }).select('avatarList coverList');

        if (!result) {
            const error = new Error("Nursery not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Nursery images retrieved successfully.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

// todo: need to test this
exports.updateNurseryImages = async (req, res, next) => {
    try {
        if (!req.role.includes("seller") || !req.nursery) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 401;
            throw error;
        }

        const { public_id, url } = req.body;

        image = {
            public_id,
            url
        }

        const result = await nurseryModel.findOneAndUpdate({ user: req.user, _id: req.nursery }, {
            $set: {
                [req.body.type]: image
            },
        }, {
            new: true
        });

        if (!result) {
            const error = new Error("Failed to update nursery images.");
            error.statusCode = 400;
            throw error;
        }

        const info = {
            status: true,
            message: "Nursery image updated successfully.",
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

// todo: need to test this 
exports.deleteNurseryImage = async (req, res, next) => {
    try {
        if (!req.role.includes("seller") || !req.nursery) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 401;
            throw error;
        }

        const { imageId, type } = req.body;
        
        // Determine which list to update based on the type (avatar or cover)
        const listToUpdate = type === "avatar" ? "avatarList" : "coverList";
        
        // Find the nursery document belonging to the user and containing the specified imageId
        const nursery = await nurseryModel.findOneAndUpdate(
            { user: req.user, _id: req.nursery },
            { $pull: { [listToUpdate]: { _id: imageId } } },
            { new: true }
        );

        if (!nursery) {
            const error = new Error("Nursery not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Image deleted successfully.",
            result: nursery
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};
