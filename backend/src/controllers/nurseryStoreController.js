const nurseryStore = require('../model/nurseryStore');
const { deleteResourcesByPrefix, deleteFolder, uploadImage } = require('../utils/uploadImages');

exports.addNurseryStoreSection = async (req, res) => {
    try {

        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const newNurseryStoreSection = new nurseryStore(req.body);
        await newNurseryStoreSection.save();

        const info = {
            status: true,
            message: "New Section of Store is added successfully.",
            result: newNurseryStoreSection
        };

        res.status(201).send(info);

    } catch (error) {
        next(error);
    }
};

exports.getAllNurseryStoreData = async (req, res, next) => {
    try {

        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const result = await nurseryStore.find({ user: req.user, nursery: req.nursery });

        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "List of all nursery store data",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

exports.getNurseryStoreSectionById = async (req, res, next) => {
    try {

        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const result = await nurseryStore.findById(_id);

        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Fetched nursery Store section data.",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

exports.updateNurseryStoreSection = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const { user, nursery, status, tabName, renders } = req.body;

        const result = await nurseryStore.findOneAndUpdate(
            { _id, user: req.user, nursery: req.nursery },
            { $set: { nursery, status, user, status, renders, tabName } },
            { new: true }
        );

        if (!result) {
            const error = new Error("Data not found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Nursery Store Section Data is updated.",
            result: result
        };

        res.status(200).json(info);
    } catch (error) {
        next(error);
    }
};


exports.deleteNurseryStoreSection = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const _id = req.params.id;
        const result = await nurseryStore.findOneAndDelete({ _id, nursery: req.nursery, user: req.user });

        if (!result) {
            const error = new Error("No Data Found.");
            error.statusCode = 404;
            throw error;
        }

        await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${_id}`, {
            type: 'upload',
            resource_type: 'image',
            invalidate: true
        });

        await deleteFolder(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${_id}`);

        const info = {
            status: true,
            message: "Deleted Nursery Store Section Data.",
            result: result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

exports.uploadNurseryStoreImage = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        if (!req.files) {
            const error = new Error("Invalid Images to upload.");
            error.statusCode = 400;
            throw error;
        }

        const _id = req.params.id;
        const image = req.files[_id];
        const { tabId, rendersId } = req.body;

        const upload = await uploadImage(image, {
            folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${tabId}/${rendersId}`,
        });

        const { public_id, secure_url } = upload;

        const result = await nurseryStore.updateOne({ "renders.images._id": _id }, {
            $set: {
                "renders.$[outer].images.$[inner]": { public_id, url: secure_url },
            }
        }, {
            arrayFilters: [
                { 'outer._id': rendersId },
                { 'inner._id': _id }
            ],
        });

        if (!result) {
            const error = new Error("Failed to update image.");
            error.statusCode = 400;
            throw error;
        }

        const info = {
            status: true,
            message: "Image updated successfully.",
            result: {
                tabId,
                rendersId,
                imageId: _id,
                image: {
                    public_id,
                    url: secure_url
                }
            }
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};
