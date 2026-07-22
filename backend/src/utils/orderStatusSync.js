const Order = require('../model/checkoutModel/orders');
const VendorOrder = require('../model/checkoutModel/vendorOrder');

/**
 * Calculates and updates the overall order status based on all vendor orders.
 * This can be triggered via webhook or as a background job.
 * @param {String} orderId 
 */
const syncOverallOrderStatus = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) return;

        const vendorOrders = await VendorOrder.find({ order: orderId });
        
        if (vendorOrders.length === 0) return;

        let allDelivered = true;
        let anyProcessing = false;
        let anyDispatched = false;
        let allCancelled = true;

        vendorOrders.forEach(vo => {
            const status = vo.orderStatus.status.toLowerCase();
            
            if (status !== 'delivered') allDelivered = false;
            if (status !== 'cancelled') allCancelled = false;
            
            if (status === 'processing') anyProcessing = true;
            if (status === 'dispatched') anyDispatched = true;
        });

        let newStatus = "Processing";

        if (allDelivered) {
            newStatus = "Delivered";
        } else if (allCancelled) {
            newStatus = "Cancelled";
        } else if (anyDispatched) {
            newStatus = "Partially Dispatched";
        } else if (anyProcessing) {
            newStatus = "Processing";
        } else {
            newStatus = "Mixed";
        }

        order.overallStatus = newStatus;
        await order.save();
        
        console.log(`[StatusSync] Order ${orderId} synced to ${newStatus}`);
    } catch (err) {
        console.error(`[StatusSync] Error syncing order ${orderId}:`, err);
    }
};

module.exports = {
    syncOverallOrderStatus
};
