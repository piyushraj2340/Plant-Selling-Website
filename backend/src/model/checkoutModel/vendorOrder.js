const mongoose = require('mongoose');

const vendorOrderSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        ref: "orders",
        required: [true, "Parent Order Id is required."],
        immutable: true
    },
    nursery: {
        type: mongoose.Schema.ObjectId,
        ref: "nursery",
        required: [true, "Nursery Id is required."],
        immutable: true
    },
    orderItems: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "orderItem"
        }
    ],
    orderStatus: {
        status: {
            type: String,
            default: "Processing"
        },
        message: {
            type: String,
            default: "Order is processing."
        },
        statusAt: {
            type: Date,
            default: Date.now
        }
    },
    delivery: {
        trackingNumber: String,
        carrier: String,
        deliveryPersonName: String,
        deliveredAt: Date,
        expectedDelivery: Date
    },
    pricing: {
        subTotal: {
            type: Number,
            required: true
        },
        shippingFee: {
            type: Number,
            default: 0
        },
        nurseryDiscount: {
            type: Number,
            default: 0
        },
        netAmountOwed: {
            type: Number,
            required: true
        }
    },
    settlement: {
        isSettled: {
            type: Boolean,
            default: false
        },
        payoutDate: Date,
        payoutTransactionId: String
    }
}, { timestamps: true });

const vendorOrderModel = mongoose.model("vendorOrder", vendorOrderSchema);

module.exports = vendorOrderModel;
