const mongoose = require('mongoose');
const nurseryStoresBlock = require('../../model/nurseryModel/nurseryStoreBlocks');
const nurseryStoreTabs = require('../../model/nurseryModel/nurseryStoreTabs');
const nurseryStoresTemplate = require('../../model/nurseryModel/nurseryStoreTemplates');
const nursery = require('../../model/nurseryModel/nursery');
const nurseryStoreContact = require('../../model/nurseryModel/nurseryStoreContact');


exports.getNurseryDetail = async function (req, res, next) {
    try {
        const id = req.params.id;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Public Store Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const nurseryDetails = await nursery.findById(id).select("-user -nurseryOwnerName -avatarList -coverList");

        //! Data Not found
        if (!nurseryDetails) {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }


        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Nursery Store Detail",
            result: nurseryDetails
        }

        //* Sending Response 
        res.status(200).send(info);


    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

exports.getAllTabsNurseryStorePublicView = async function (req, res, next) {
    try {
        const id = req.params.id;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Public Store Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const nurseryTabs = await nurseryStoreTabs.find({ nursery: id, status: 'publish' }).select("-user");

        //! Data Not found
        if (!nurseryTabs) {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }


        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Nursery Store Tab Data",
            result: nurseryTabs
        };

        //* Sending Response 
        res.status(200).send(info);


    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

exports.getAllTemplatesNurseryStorePublicView = async function (req, res, next) {
    try {
        const {nurseryId, tabId} = req.params;

        //! Checking for the the correct route 
        if (!nurseryId) {
            const error = new Error("Incorrect Routes: Nursery Public Store Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const nurseryTabs = await nurseryStoreTabs.findOne({ _id: tabId, nursery: nurseryId, status: 'publish' }).select("status");

        //! Data Not found
        if (!nurseryTabs || !nurseryTabs.status || nurseryTabs.status !== 'publish') {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const nurseryTemplate = await nurseryStoresTemplate.find({ nursery: nurseryId }).select("-user");

        //! Data Not found
        if (!nurseryTemplate) {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Nursery Store Template Data",
            result: nurseryTemplate
        };

        //* Sending Response 
        res.status(200).send(info);


    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

exports.getAllBlocksNurseryStorePublicView = async function (req, res, next) {
    try {
        const {nurseryId, tabId} = req.params;

        //! Checking for the the correct route 
        if (!nurseryId) {
            const error = new Error("Incorrect Routes: Nursery Public Store Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const nurseryTabs = await nurseryStoreTabs.findOne({ _id: tabId, nursery: nurseryId, status: 'publish' }).select("status");

        //! Data Not found
        if (!nurseryTabs || !nurseryTabs.status || nurseryTabs.status !== 'publish') {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }

        //* Getting the data from the database
        const nurseryTemplate = await nurseryStoresBlock.find({ nursery: nurseryId }).select("-user");

        //! Data Not found
        if (!nurseryTemplate) {
            const error = new Error("No Data Found");
            error.statusCode = 404;
            throw error;
        }

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Nursery Store Blocks Data",
            result: nurseryTemplate
        };

        //* Sending Response 
        res.status(200).send(info);


    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

exports.nurseryStoreContactUs = async function (req, res, next) {
    try {
        const id = req.params.id;

        const { name, email, message, user } = req.body;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Public Store Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Inserting the contact us data into database
        const nurseryStoreContactUs = new nurseryStoreContact({ name, email, message, user, nursery: id });
        await nurseryStoreContactUs.save();

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Thank you for contacting nursery",
        };

        //* Sending Response 
        res.status(201).send(info);

    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

exports.getNurseryStoreMessage = async function (req, res, next) {
    try {
        const id = req.params.id;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Public Store Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Inserting the contact us data into database
        const nurseryStoreContactUs = await nurseryStoreContact.find({ nursery: id });

        //* Preparing Response Object 
        const info = {
            status: true,
            message: "Getting Nursery Store Message",
            nurseryMessage: nurseryStoreContactUs
        };

        //* Sending Response 
        res.status(200).send(info);

    } catch (error) {
        //! Sending Error Response to Middleware
        next(error);
    }
}

exports.NurseryStoreMessageMarkAsViewed = async function (req, res, next) {
    try {
        const id = req.params.nurseryId;
        const _id = req.params.messageId;

        //! Checking for the the correct route 
        if (!id) {
            const error = new Error("Incorrect Routes: Nursery Public Store Id is required");
            error.statusCode = 404;
            throw error;
        }

        //* Inserting the contact us data into database
        const nurseryMessage = await nurseryStoreContact.findOneAndUpdate({
                nursery: id, _id 
            },{
                 $set: { 
                    isMessageViewed: true 
                 },
            }, {
                new: true
            });

    //* Preparing Response Object 
    const info = {
        status: true,
        message: "Getting Nursery Store Message",
        nurseryMessage
    };

    //* Sending Response 
    res.status(200).send(info);

} catch (error) {
    //! Sending Error Response to Middleware
    next(error);
}
}