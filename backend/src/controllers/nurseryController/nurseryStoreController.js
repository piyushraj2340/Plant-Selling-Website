const mongoose = require('mongoose');
const nurseryStoresBlock = require('../../model/nurseryModel/nurseryStoreBlocks');
const nurseryStoreTabs = require('../../model/nurseryModel/nurseryStoreTabs');
const nurseryStoresTemplate = require('../../model/nurseryModel/nurseryStoreTemplates');
const trimData = require('../../utils/trimData');

const { deleteResourcesByPrefix, deleteFolder, uploadImage, deleteImages } = require('../../utils/uploadImages');


//#region NurseryStoreTabs API

//* Add New Nursery Store Tabs -- Create new Tab
exports.addNurseryStoreTabs = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //* Add Tabs Information 
        const newNurseryStoreTabs = new nurseryStoreTabs(trimData(req.body));
        await newNurseryStoreTabs.save();


        //! If data is not saved to database
        if (!newNurseryStoreTabs) {
            const error = new Error("Failed to add new nursery store tab");
            error.statusCode = 400;
            throw error;
        }

        //? Extracting the object mongodb sync data...
        const result = { ...newNurseryStoreTabs._doc };

        //! Delete the unwanted data form the result
        delete result.user;
        delete result.nursery;

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "New tab is added to the nursery store page.",
            result
        };

        //* Sending Response 
        res.status(201).send(info);

    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
};

//* Get Tab by id -- Get by id 
exports.getNurseryStoreTabById = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const id = req.params.id;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Store Tab Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoreTabs.findById(id);

        //! Data Not found
        if (!result) {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }


        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Nursery Store Tab Data",
            result: result
        };

        //* Sending Response 
        res.status(200).send(info);


    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

//* Get All the Tabs Data -- Get All Tabs
exports.getAllNurseryStoreTabs = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoreTabs.find({ user: req.user, nursery: req.nursery }).select("-user -nursery").sort({ index: 1 });

        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "List of all the store tabs data",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

//* Edit the nursery store tabs data 
exports.editNurseryStoreTab = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //? FINDING THE IDS
        const id = req.params.id;

        //? UPDATE THE TAB DATA
        const result = await nurseryStoreTabs.findByIdAndUpdate({ _id: id }, trimData(req.body), {
            new: true
        });

        //! IF DATA IS NOT FOUND
        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        //* PREPARING THE RESPONSE OBJECTS
        const info = {
            status: true,
            message: "Edited Nursery Store Tabs",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

//* Delete nursery store tabs data, and also delete all the templates and block from the store data....
exports.deleteNurseryStoreTab = async (req, res, next) => { //TODO: Add the transaction to delete the multiple store tabs and template data.... 
    //? START_SESSION
    const session = await mongoose.startSession();
    try {

        //* SESSION_STARTED
        session.startTransaction();

        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //? GETTING DATA...
        const id = req.params.id;

        //* FINDING AND DELETING TABS....
        const result = await nurseryStoreTabs.findByIdAndDelete(id, { session });

        //! IF DATA NOT FOUND....
        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        //* FINDING AND DELETING TEMPLATES....
        await nurseryStoresTemplate.deleteMany({ nurseryStoreTabs: id }, { session });

        //* FINDING AND DELETING BLOCKS....
        await nurseryStoresBlock.deleteMany({ nurseryStoreTabs: id }, { session });

        //? DELETING ALL THE IMAGES FORM THE CLOUDINARY
        await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${result.nurseryStoreTabs}`, {
            type: 'upload',
            resource_type: 'image',
            invalidate: true
        });

        //* COMMIT_TRANSACTIONS
        await session.commitTransaction();

        const info = {
            status: true,
            message: "Edited Nursery Store Tabs",
            result: {
                _id: result._id //? ONly sending the id as a response...
            }
        };
        res.status(200).send(info);

    } catch (error) {
        //! ABORT_TRANSACTION
        await session.abortTransaction();

        //! Sending Error Response to Middleware
        next(error);
    } finally {
        //* END_SESSION
        await session.endSession();
    }
};


//#endregion 


//#region NurseryStoreTemplate API

//* Add New Nursery Store Templates -- Create new Template
exports.addNurseryStoreTemplates = async (req, res, next) => {
    //? START_SESSION
    const session = await mongoose.startSession();
    try {

        //* SESSION_STARTED
        session.startTransaction();

        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //* GETTING_DATA_FROM_SESSION
        const { nurseryStoreTabs, index, templateName } = trimData(req.body);


        if (index < 0) {
            const error = new Error("Index Parameter Should Not be -Ve.");
            error.statusCode = 400;
            throw error;
        }


        //? UPDATE_INDEX_ORDER OF THE EXISTING TEMPLATE
        //& SUPPOSE WE HAVE TO ADD THE TEMPLATE AT INDEX 2 BUT WE HAVE ALREADY DATA AT INDEX 2, AND INDEX 3 AND SOO ON....
        //& SO MAKE VACANT SPACE BEFORE ADDING TEMPLATE DATA AT THAT INDEX

        //* GETTING THE CURRENT INDEX FOR THE NEW TEMPLATE AT THE SPECIFIED INDEX
        const getIndexForStoreTemplate = await nurseryStoresTemplate.findOne({
            user: req.user,
            nursery: req.nursery,
            nurseryStoreTabs,
            index
        });

        //* IF THERE IS DATA AT THE INDEX THEN MAKE VACANT SPACE BEFORE ADDING THE NEW TEMPLATE
        if (getIndexForStoreTemplate) {
            const updateIndexForStoreTemplate = await nurseryStoresTemplate.updateMany({
                user: req.user,
                nursery: req.nursery,
                nurseryStoreTabs,
                index: { $gte: index }
            }, {
                $inc: { index: 1 }
            }, {
                new: true,
                session
            });

            console.log(updateIndexForStoreTemplate);
        }

        //* Add Templates Information 
        const newNurseryStoreTemplates = new nurseryStoresTemplate({ user: req.user, nursery: req.nursery, nurseryStoreTabs, index, templateName });

        //* HANDLING_QUERY_WITH_TRANSACTION
        await newNurseryStoreTemplates.save({ session });

        //! Failed to add Nursery Store Templates
        if (!newNurseryStoreTemplates) {
            const error = new Error("Failed to add new nursery store template");
            error.statusCode = 400;
            throw error;
        }

        //* COMMIT_TRANSACTIONS
        await session.commitTransaction();

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "New new store template is added to the nursery store tabs",
            result: newNurseryStoreTemplates
        };

        //* Sending Response 
        res.status(201).send(info);


    } catch (error) {
        //! ABORT_TRANSACTION
        await session.abortTransaction();

        //! Sending Error Response to Middleware
        next(error);
    } finally {
        //* END_SESSION
        await session.endSession();
    }
}

//* Get Template by id -- Get by id 
exports.getNurseryStoreTemplateById = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const id = req.params.id;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Store Template Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoresTemplate.findById(id);

        //! Data Not found
        if (!result) {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }


        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Nursery Store Template Data",
            result: result
        };

        //* Sending Response 
        res.status(200).send(info);


    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

//* Get All the Template Data -- Get All Tabs
exports.getAllNurseryStoreTemplate = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoresTemplate.find({ user: req.user, nursery: req.nursery }).select("-user -nursery");

        //! Data Not Found
        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        //* Preparing Data object for sending the response 
        const info = {
            status: true,
            message: "List of All the templates data",
            result
        };

        //* Sending Response
        res.status(200).send(info);

    } catch (error) {
        //! Sending Error to the Middleware 
        next(error);
    }
};

exports.getAllNurseryStoreTemplateByTabId = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const { id } = req.params;

        if (!id) {
            const error = new Error("Invalid Route Parameters");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoresTemplate.find({ user: req.user, nursery: req.nursery, nurseryStoreTabs: id }).select("-user -nursery").sort({ index: 1 });

        //! Data Not Found
        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        //* Preparing Data object for sending the response 
        const info = {
            status: true,
            message: "List of All the templates data",
            result
        };

        //* Sending Response
        res.status(200).send(info);

    } catch (error) {
        //! Sending Error to the Middleware 
        next(error);
    }
};

//* Edit the nursery store Template data  -- Edit by id 
exports.editNurseryStoreTemplate = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const id = req.params.id;

        const result = await nurseryStoresTemplate.findByIdAndUpdate({ _id: id }, req.body, {
            new: true
        });

        //! If Data Not Found 
        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        //* Preparing Response Object
        const info = {
            status: true,
            message: "Edited Nursery Store Tabs",
            result
        };

        //* Sending Response
        res.status(200).send(info);

    } catch (error) {
        //! Sending error to middleware 
        next(error);
    }
};

//* Change render position
exports.editNurseryStoreTemplate = async (req, res, next) => {
    //? START_SESSION
    const session = await mongoose.startSession();
    try {

        //* SESSION_STARTED
        session.startTransaction();


        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //* GETTING_DATA_FROM_FORM_BODY...
        const { preData, nextData } = trimData(req.body);


        //! IF DATA NOT FOUND WITH THAT INDEX
        if (!preData || !nextData) {
            const error = new Error("Data Not Found At Specified Index.");
            error.statusCode = 404;
            throw error;
        }

        //! CHECKING IF THE INDEX IS -VE... 
        if (preData.index < 0 || nextData.index < 0 || Math.abs(nextData.index - preData.index) != 1) { //^ 0 - 1 == 1 || 1 - 0 == 1 -- Change one place at a time...
            const error = new Error("Invalid input parameters");
            error.statusCode = 400;
            throw error;
        }

        //? WE NEED TO SWAP THE INDEX PRE AND NEXT TO CHANGE THE RENDER POSITION OF THE TEMPLATE 
        //^ NOTE: I HAVE CREATED THIS LOGIC TO CHANGE THE RENDER POSITION BASED ON INDEX AND IT WILL SHIFT ONE PLACE AT A TIME 
        //^ SUPPOSE WE NEED TO SHIFT THE INDEX 0 TO 1 TO 2 TO 3 AND SO ON IN FORWARD DIRECTION OR BACKWARD DIRECTION LIKE 3 TO 2 TO 1 AND SO ON....





        //? UPDATE THE PRE_TEMPLATE_DATA USING THE NEXT_TEMPLATE_DATA....
        const updatePreData = await nurseryStoresTemplate.findByIdAndUpdate(preData._id, {
            $set: {
                index: nextData.index
            }
        }, {
            new: true,
            session
        });

        //? UPDATE THE NEXT_TEMPLATE_DATA USING THE PRE_TEMPLATE_DATA....
        const updateNextData = await nurseryStoresTemplate.findByIdAndUpdate(nextData._id, {
            $set: {
                index: preData.index
            }
        }, {
            new: true,
            session
        });


        if (!updatePreData || !updateNextData) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }


        //* COMMIT_TRANSACTIONS
        await session.commitTransaction();

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "New new store template is added to the nursery store tabs",
            result: {
                updatePreData,
                updateNextData
            }
        };

        //* Sending Response 
        res.status(201).send(info);


    } catch (error) {
        //! ABORT_TRANSACTION
        await session.abortTransaction();

        //! Sending Error Response to Middleware
        next(error);
    } finally {
        //* END_SESSION
        await session.endSession();
    }
};

//* Delete the nursery store Template data -- Delete by id 
exports.deleteNurseryStoreTemplate = async (req, res, next) => { //TODO: Add the transaction to delete the multiple store tabs and template data.... 
    //? START_SESSION
    const session = await mongoose.startSession();
    try {

        //* SESSION_STARTED
        session.startTransaction();

        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //* GETTING_DATA
        const id = req.params.id;

        //? FINDING AND DELETING TEMPLATES
        const result = await nurseryStoresTemplate.findByIdAndDelete(id, { session });


        //! IF DATA NOT FOUND
        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        //? FINDING AND RESETTING THE INDEX 
        await nurseryStoresTemplate.updateMany({ nurseryStoreTabs: result.nurseryStoreTabs, index: { $gt: result.index } }, { $inc: { index: -1 } }, { session });

        //? FINDING AND DELETING ALL BLOCKS
        await nurseryStoresBlock.deleteMany({ nurseryStoreTemplate: id }, { session });


        //? DELETING ALL THE IMAGES FORM THE CLOUDINARY
        await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${result.nurseryStoreTabs}/${id}`, {
            type: 'upload',
            resource_type: 'image',
            invalidate: true
        });

        //* COMMIT_TRANSACTIONS
        await session.commitTransaction();

        //* PREPARING RESPONSE OBJECT
        const info = {
            status: true,
            message: "Edited Nursery Store Tabs",
            result: {
                _id: result._id //? ONly sending the id as a response...
            }
        };
        res.status(200).send(info);

    } catch (error) {
        //! ABORT_TRANSACTION
        await session.abortTransaction();

        //! Sending Error Response to Middleware
        next(error);
    } finally {
        //* END_SESSION
        await session.endSession();
    }
};

//#endregion


//#region NurseryStoreBlock API

//* Add New Nursery Block Tabs -- Create new Tab
exports.addNurseryStoreBlock = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //? GETTING_INFORMATION_FROM_APPLICATION
        const { nurseryStoreTabs, nurseryStoreTemplates, title, index, url } = req.body;
        const { image } = req.files;

        //! If we do not have an image
        if (!image) {
            const error = new Error("Invalid Images to upload");
            error.statusCode = 400;
            throw error;
        }

        //* Uploading the Images 
        const upload = await uploadImage(image, {
            folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${nurseryStoreTabs}/${nurseryStoreTemplates}`,
        });

        //* Extracting the images data...
        const { public_id, secure_url } = upload;


        //! IF WE ARE NOT ABLE TO UPLOAD IMAGES....
        if (!public_id || !secure_url) {
            const error = new Error("Failed to Upload Images...");
            error.statusCode = 400;
            throw error;
        }

        //* Add Tabs Information 
        const newNurseryStoreBlock = new nurseryStoresBlock({ user: req.user, nursery: req.nursery, nurseryStoreTabs, nurseryStoreTemplates, title, index, url, image: { url: secure_url, public_id } });
        await newNurseryStoreBlock.save();

        //! If data is not saved to database
        if (!newNurseryStoreBlock) {
            const error = new Error("Failed to add new nursery store Block");
            error.statusCode = 400;
            throw error;
        }

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "New Block is added to the nursery store page.",
            result: newNurseryStoreBlock
        };

        //* Sending Response 
        res.status(201).send(info);

    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
};

//* Get Block by id -- Get by id 
exports.getNurseryStoreBlockById = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const id = req.params.id;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Store Tab Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoresBlock.findById(id);

        //! Data Not found
        if (!result) {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }


        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Nursery Store Block Data",
            result: result
        };

        //* Sending Response 
        res.status(200).send(info);


    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

//* Get All the Tabs Data -- Get All Tabs
exports.getAllNurseryStoreBlock = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoresBlock.find({ user: req.user, nursery: req.nursery }).select("-user -nursery");

        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "List of all the block data",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

exports.getAllNurseryStoreBlockByTabId = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const { id } = req.params;

        if (!id) {
            const error = new Error("Invalid Routes Parameters");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const result = await nurseryStoresBlock.find({ user: req.user, nursery: req.nursery, nurseryStoreTabs: id }).select("-user -nursery").sort({ index: 1 });

        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "List of all the block data",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

//* Edit the nursery store tabs data 
exports.editNurseryStoreBlock = async (req, res, next) => {
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //? GETTING DATA 
        const id = req.params.id;

        //? GETTING_INFORMATION_FROM_APPLICATION
        const { nurseryStoreTabs, nurseryStoreTemplates, title, url, old_img_public_id } = req.body;


        //? GETTING IMAGE DATA...
        const image = req.files?.image;

        //* IF WE NEED TO RE-UPLOAD THE IMAGES....
        if (image) {
            //* Uploading the Images 
            const upload = await uploadImage(image, {
                folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${nurseryStoreTabs}/${nurseryStoreTemplates}`,
            });

            //* Extracting the images data...
            const { public_id, secure_url } = upload;

            //! IF WE ARE NOT ABLE TO UPLOAD IMAGES....
            if (!public_id || !secure_url) {
                const error = new Error("Failed to Upload Images...");
                error.statusCode = 400;
                throw error;
            }

            //? Preparing data for update
            const data = {
                nurseryStoreTabs,
                nurseryStoreTemplates,
                title,
                url,
                image: { url: secure_url, public_id }
            }

            //? FINDING AND UPDATING DATA...
            const result = await nurseryStoresBlock.findByIdAndUpdate({ _id: id }, data, {
                new: true
            });

            //! IF DATA NOT FOUND
            if (!result) {
                const error = new Error("Data Not Found.");
                error.statusCode = 404;
                throw error;
            }

            //? DELETING THE PREVIOUS IMAGE 
            await deleteImages(old_img_public_id, {
                type: 'upload',
                resource_type: 'image',
                invalidate: true
            })

            //* PREPARING RESPONSE OBJECT
            const info = {
                status: true,
                message: "Edited Nursery Store Tabs",
                result
            };
            res.status(200).send(info);
        } else {
            //? Preparing data for update
            const data = {
                nurseryStoreTabs,
                nurseryStoreTemplates,
                title,
                url,
            }

            //? FINDING AND UPDATING DATA...
            const result = await nurseryStoresBlock.findByIdAndUpdate({ _id: id }, data, {
                new: true
            });

            //! IF DATA NOT FOUND
            if (!result) {
                const error = new Error("Data Not Found.");
                error.statusCode = 404;
                throw error;
            }

            //* PREPARING RESPONSE OBJECT
            const info = {
                status: true,
                message: "Edited Nursery Store Tabs",
                result
            };
            res.status(200).send(info);
        }
    } catch (error) {
        next(error);
    }
};

//* Delete nursery store tabs data, and also delete all the templates and block from the store data....
exports.deleteNurseryStoreBlock = async (req, res, next) => { //TODO: Add the transaction to delete the multiple store tabs and template data.... 
    try {
        //! Check for Authorization 
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //? GETTING ID 
        const id = req.params.id;

        //? FINDING AND DELETING DATA 
        const result = await nurseryStoresBlock.findByIdAndDelete(id);

        //! IF DATA NOT FOUND
        if (!result) {
            const error = new Error("Data Not Found.");
            error.statusCode = 404;
            throw error;
        }

        //? DELETE THE IMAGES FORM THE CLOUDINARY
        await deleteImages(result.image.public_id, {
            type: 'upload',
            resource_type: 'image',
            invalidate: true
        });

        //* PREPARING THE RESPONSE
        const info = {
            status: true,
            message: "Edited Nursery Store Tabs",
            result: {
                _id: result._id //? ONly sending the id as a response...
            }
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

//#endregion





// exports.getNurseryStoreSectionById = async (req, res, next) => {
//     try {

//         if (!req.nursery || !req.role.includes('seller')) {
//             const error = new Error("You are not allowed to access this route");
//             error.statusCode = 403;
//             throw error;
//         }

//         const _id = req.params.id;
//         const result = await nurseryStore.findById(_id);

//         if (!result) {
//             const error = new Error("Data Not Found.");
//             error.statusCode = 404;
//             throw error;
//         }

//         const info = {
//             status: true,
//             message: "Fetched nursery Store section data.",
//             result
//         };
//         res.status(200).send(info);

//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateNurseryStoreSection = async (req, res, next) => {
//     try {
//         if (!req.nursery || !req.role.includes('seller')) {
//             const error = new Error("You are not allowed to access this route");
//             error.statusCode = 403;
//             throw error;
//         }

//         const _id = req.params.id;
//         const { user, nursery, status, tabName, renders } = req.body;

//         const result = await nurseryStore.findOneAndUpdate(
//             { _id, user: req.user, nursery: req.nursery },
//             { $set: { nursery, status, user, status, renders, tabName } },
//             { new: true }
//         );

//         if (!result) {
//             const error = new Error("Data not found.");
//             error.statusCode = 404;
//             throw error;
//         }

//         const info = {
//             status: true,
//             message: "Nursery Store Section Data is updated.",
//             result: result
//         };

//         res.status(200).json(info);
//     } catch (error) {
//         next(error);
//     }
// };


// exports.deleteNurseryStoreSection = async (req, res, next) => {
//     try {
//         if (!req.nursery || !req.role.includes('seller')) {
//             const error = new Error("You are not allowed to access this route");
//             error.statusCode = 403;
//             throw error;
//         }

//         const _id = req.params.id;
//         const result = await nurseryStore.findOneAndDelete({ _id, nursery: req.nursery, user: req.user });

//         if (!result) {
//             const error = new Error("No Data Found.");
//             error.statusCode = 404;
//             throw error;
//         }

//         await deleteResourcesByPrefix(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${_id}`, {
//             type: 'upload',
//             resource_type: 'image',
//             invalidate: true
//         });

//         await deleteFolder(`PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${_id}`);

//         const info = {
//             status: true,
//             message: "Deleted Nursery Store Section Data.",
//             result: result
//         };

//         res.status(200).send(info);
//     } catch (error) {
//         next(error);
//     }
// };



//* Uploading the Nursery Store Images...
exports.uploadNurseryStoreImage = async (req, res, next) => {
    try {
        //! Validate the Authorization
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You are not allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        //! Invalid File Upload
        if (!req.files) {
            const error = new Error("Invalid Images to upload.");
            error.statusCode = 400;
            throw error;
        }

        //* Extracting the Data...
        const _id = req.params.id;
        const image = req.files[_id];
        const { tabId, rendersId } = req.body;


        //* Uploading the Images 
        const upload = await uploadImage(image, {
            folder: `PlantSeller/user/${req.user}/nursery/${req.nursery}/store/${tabId}/${rendersId}`,
        });

        //* Extracting the images data...
        const { public_id, secure_url } = upload;

        //* Updating the Images url to the store....

        //TODO: Update the nurserystore.....
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
