const mongoose = require('mongoose');
const userModel = require('../../model/userModel/user');
const nurseryModel = require('../../model/nurseryModel/nursery');
const plantModel = require('../../model/nurseryModel/plants');
const nurseryStoresTabs = require('../../model/nurseryModel/nurseryStoreTabs');
const { deleteFolder, deleteResourcesByPrefix, uploadImage } = require('../../utils/uploadImages');

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
            error.statusCode = 403;
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
            error.statusCode = 403;
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
            const error = new Error("Nursery detail not found.");b
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
            error.statusCode = 403;
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

        //TODO: Need to see all the delete and update in the transitions query 
        const deleteAllPlants = await plantModel.deleteMany({ user: req.user, nursery: req.nursery }, { session });
        const deleteNurseryStore = await nurseryStoresTabs.deleteMany({ user: req.user, nursery: req.nursery }, { session });

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
            error.statusCode = 403;
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
            error.statusCode = 403;
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
            error.statusCode = 403;
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
            error.statusCode = 403;
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
const nurseryStoreContact = require('../../model/nurseryModel/nurseryStoreContact');

exports.getNurseryMessages = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const messages = await nurseryStoreContact.find({ nursery: req.nursery }).sort({ createdAt: -1 });

        res.status(200).send({
            status: true,
            message: "Messages retrieved.",
            nurseryMessage: messages
        });
    } catch (error) {
        next(error);
    }
};

exports.markNurseryMessageAsViewed = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const messageId = req.params.id;
        const result = await nurseryStoreContact.findOneAndUpdate(
            { _id: messageId, nursery: req.nursery },
            { isMessageViewed: true },
            { new: true }
        );

        if (!result) {
            const error = new Error("Message not found.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).send({
            status: true,
            message: "Message marked as viewed.",
            nurseryMessage: result
        });
    } catch (error) {
        next(error);
    }
};

exports.replyNurseryMessage = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const messageId = req.params.id;
        const { replyMessage } = req.body;

        if (!replyMessage) {
            const error = new Error("Reply message is required");
            error.statusCode = 400;
            throw error;
        }

        const result = await nurseryStoreContact.findOneAndUpdate(
            { _id: messageId, nursery: req.nursery },
            { 
                $push: {
                    replies: {
                        sender: 'Nursery',
                        message: replyMessage,
                        createdAt: new Date()
                    }
                },
                isMessageViewed: true 
            },
            { new: true }
        );

        const io = req.app.get('socketio');
        if (io) {
            io.to(messageId).emit('receive_message', { sender: 'Nursery', message: replyMessage, createdAt: new Date() });
        }

        if (!result) {
            const error = new Error("Message not found.");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).send({
            status: true,
            message: "Reply added via chat.",
            nurseryMessage: result
        });
    } catch (error) {
        next(error);
    }
};


const { encrypt } = require('../../utils/cryptoUtils');

exports.updateNurserySMTPSettings = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error("Email and Password are required for SMTP configuration.");
            error.statusCode = 400;
            throw error;
        }

        const encryptedPassword = encrypt(password);

        const result = await nurseryModel.findOneAndUpdate(
            { user: req.user, _id: req.nursery },
            { smtpSettings: { email, password: encryptedPassword } },
            { new: true }
        );

        res.status(200).send({
            status: true,
            message: "SMTP Settings updated successfully.",
        });
    } catch (error) {
        next(error);
    }
};

const nodemailer = require('nodemailer');
const { decrypt } = require('../../utils/cryptoUtils');

exports.replyNurseryMessageEmail = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const messageId = req.params.id;
        const { replyMessage } = req.body;

        if (!replyMessage) {
            const error = new Error("Reply message is required");
            error.statusCode = 400;
            throw error;
        }

        const nurseryInfo = await nurseryModel.findOne({ user: req.user, _id: req.nursery });
        if (!nurseryInfo || !nurseryInfo.smtpSettings || !nurseryInfo.smtpSettings.email || !nurseryInfo.smtpSettings.password) {
            const error = new Error("SMTP Settings are not configured. Please configure them in Nursery Settings.");
            error.statusCode = 400;
            throw error;
        }

        const decryptedPassword = decrypt(nurseryInfo.smtpSettings.password);
        if (!decryptedPassword) {
            const error = new Error("Invalid SMTP configuration. Please update your settings.");
            error.statusCode = 400;
            throw error;
        }

        const contactMsg = await nurseryStoreContact.findOne({ _id: messageId, nursery: req.nursery });
        if (!contactMsg) {
            const error = new Error("Message not found.");
            error.statusCode = 404;
            throw error;
        }

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Standard fallback, assuming Gmail App Password is used.
            auth: {
                user: nurseryInfo.smtpSettings.email,
                pass: decryptedPassword
            }
        });

        const mailOptions = {
            from: nurseryInfo.smtpSettings.email,
            to: contactMsg.email,
            subject: "Reply to your inquiry at ${nurseryInfo.nurseryName}",
            text: replyMessage,
            html: "<p>Dear ${contactMsg.name},</p><p>${replyMessage.replace(/\n/g, '<br>')}</p><p>Regards,<br>${nurseryInfo.nurseryName}</p>"
        };

        await transporter.sendMail(mailOptions);

        // Also save to DB chat history
        const result = await nurseryStoreContact.findOneAndUpdate(
            { _id: messageId, nursery: req.nursery },
            { 
                $push: {
                    replies: {
                        sender: 'Nursery',
                        message: replyMessage + " (Sent via Email)",
                        createdAt: new Date()
                    }
                },
                isMessageViewed: true 
            },
            { new: true }
        );

        const io = req.app.get('socketio');
        if (io) {
            io.to(messageId).emit('receive_message', { sender: 'Nursery', message: replyMessage + " (Sent via Email)", createdAt: new Date() });
        }

        res.status(200).send({
            status: true,
            message: "Reply sent via Email.",
            nurseryMessage: result
        });
    } catch (error) {
        next(error);
    }
};

exports.updateNurseryMessageStatus = async (req, res, next) => {
    try {
        if (!req.nursery || !req.role.includes('seller')) {
            const error = new Error("You Are Not Allowed to access this route");
            error.statusCode = 403;
            throw error;
        }

        const messageId = req.params.id;
        const { status } = req.body;

        if (!status || !['open', 'resolved', 'closed'].includes(status)) {
            const error = new Error("Invalid status");
            error.statusCode = 400;
            throw error;
        }

        const result = await nurseryStoreContact.findOneAndUpdate(
            { _id: messageId, nursery: req.nursery },
            { status: status },
            { new: true }
        );

        res.status(200).send({
            status: true,
            message: "Status updated successfully.",
            nurseryMessage: result
        });
    } catch (error) {
        next(error);
    }
};
