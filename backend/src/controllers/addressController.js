const addressModel = require('../model/address');
const mongoose = require('mongoose');

//* POST API 
//* ADD: New Shipping Address
exports.addAddress = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction(); //^ transaction Started 

        //? remove the default shipping address and set new default shipping address
        if (req.body.setAsDefault) {
            await addressModel.updateMany({ user: req.user, setAsDefault: true }, {
                $set: {
                    setAsDefault: false
                }
            }, { session });
        }

        //* Add: New Address
        const newAddress = new addressModel(req.body);
        await newAddress.save({ session });
        await session.commitTransaction(); //* commit transaction

        const info = {
            status: true,
            message: "New Address Added Successfully",
            result: newAddress
        };
        res.status(200).send(info);

    } catch (error) {
        await session.abortTransaction(); //! abort the transaction
        next(error);
    } finally {
        await session.endSession(); //& close the session
    }
};

//? GET API
//* GET: List of addresses
exports.getAddressList = async (req, res, next) => {
    try {
        //* get: List of Address
        const result = await addressModel.find({ user: req.user });

        //! address not found
        if (!result) {
            const error = new Error("No Address Found.");
            error.statusCode = 404;
            throw error;
        }

        //* sorting the result so that the default address will be at index 0
        result.sort((a, b) => {
            if (a.setAsDefault === true) return -1;
            if (b.setAsDefault === true) return 1;
        })

        const info = {
            status: true,
            message: "List of addresses",
            result
        };
        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

//? GET API
//* GET: Address By Id
exports.getAddressById = async (req, res, next) => {
    try {
        //* get: address by id
        const address = await addressModel.findOne({ _id: req.params.id, user: req.user });

        //! address not found
        if (!address) {
            const error = new Error("Address not found");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Address retrieved successfully",
            result: address
        };

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};

//^ Update API
//* Update: Update address
exports.updateAddress = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction(); //^ Transition Started

        if (req.body.setAsDefault === true) {
            await addressModel.updateMany({ user: req.user, setAsDefault: true }, {
                $set: {
                    setAsDefault: false
                }
            }, { session });
        }

        //* update: address
        const result = await addressModel.findByIdAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            session
        });

        //! address not found
        if (!result) {
            const error = new Error("Address not found");
            error.statusCode = 404;
            throw error;
        }

        await session.commitTransaction(); //* Transition committed
        const info = {
            status: true,
            message: "Address updated successfully",
            result
        };

        res.status(200).send(info);

    } catch (error) {
        await session.abortTransaction(); //! Transition Aborted
        next(error);
    } finally {
        await session.endSession(); //& Session Closed
    }
};

//! Delete API
//* Delete: Address
exports.deleteAddress = async (req, res, next) => {
    try {
        //* delete address
        const result = await addressModel.findByIdAndDelete(req.params.id);

        //! address not found
        if (!result) {
            const error = new Error("Address not found");
            error.statusCode = 404;
            throw error;
        }

        const info = {
            status: true,
            message: "Address deleted successfully",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};

//? GET API
//* Get: Default Address
exports.getDefaultAddress = async (req, res, next) => {
    try {
        //* Get All address
        const address = await addressModel.find({ user: req.user });

        //! address not found
        if (!address) {
            const error = new Error("Address not found");
            error.statusCode = 404;
            throw error;
        }

        //* Find default Address
        const defaultAddress = address.find(address => address.setAsDefault === true);

        const info = {
            status: true,
            message: "Default or last use address.",
            result: defaultAddress ? defaultAddress : address[address.length - 1] || [] //* if default address present else recent added address.
        }

        res.status(200).send(info);

    } catch (error) {
        next(error);
    }
};
