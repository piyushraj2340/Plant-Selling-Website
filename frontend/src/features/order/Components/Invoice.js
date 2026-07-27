import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetailsByIdAsync } from '../orderSlice';
import formatTimestamp from '../../../utils/formatTimestamp';

const Invoice = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const orderDetails = useSelector((state) => state.order.orderDetails);

    useEffect(() => {
        dispatch(getOrderDetailsByIdAsync(id));
    }, [dispatch, id]);

    const handlePrint = () => {
        window.print();
    };

    if (!orderDetails) {
        return <div className="text-center p-5">Loading Invoice...</div>;
    }

    return (
        <div className="container bg-white p-4 p-md-5 my-4 shadow-sm" style={{ maxWidth: '900px' }}>
            {/* Action Bar (Hidden when printing) */}
            <div className="d-flex justify-content-between align-items-center mb-4 no-print border-bottom pb-3">
                <Link to={`/orders/details/${id}`} className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-2"></i> Back to Order
                </Link>
                <button onClick={handlePrint} className="btn btn-primary">
                    <i className="fas fa-print me-2"></i> Print Invoice
                </button>
            </div>

            {/* Invoice Header */}
            <div className="row mb-5 pb-3 border-bottom">
                <div className="col-sm-6">
                    <h2 className="text-success fw-bold mb-0">PlantSeller</h2>
                    <p className="text-muted">Bringing Nature to Your Doorstep</p>
                    <div className="mt-4">
                        <strong>From:</strong><br />
                        PlantSeller Retail Pvt Ltd.<br />
                        123 Green Avenue, Sector 4<br />
                        New Delhi, 110001, India<br />
                        Email: support@plantseller.com<br />
                        GSTIN: 07AABCU9603R1ZM
                    </div>
                </div>
                <div className="col-sm-6 text-sm-end mt-4 mt-sm-0">
                    <h1 className="text-uppercase fw-bold text-muted mb-3">Invoice</h1>
                    <div><strong>Invoice No:</strong> INV-{orderDetails._id.substring(0, 8).toUpperCase()}</div>
                    <div><strong>Order ID:</strong> {orderDetails._id}</div>
                    <div><strong>Order Date:</strong> {formatTimestamp(orderDetails.orderAt)}</div>
                    <div><strong>Payment Method:</strong> {orderDetails.payment.paymentMethods}</div>
                    <div><strong>Payment Status:</strong> {orderDetails.payment.status}</div>
                </div>
            </div>

            {/* Billing & Shipping Details */}
            <div className="row mb-5">
                <div className="col-sm-6">
                    <h5 className="text-uppercase border-bottom pb-2 mb-3">Billed / Shipped To</h5>
                    <strong>{orderDetails.shippingInfo.name}</strong><br />
                    {orderDetails.shippingInfo.address}<br />
                    {orderDetails.shippingInfo.landmark && <>{orderDetails.shippingInfo.landmark}<br /></>}
                    {orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} - {orderDetails.shippingInfo.pinCode}<br />
                    India<br />
                    <strong>Phone:</strong> {orderDetails.shippingInfo.phone}
                </div>
            </div>

            {/* Items Table */}
            <div className="table-responsive mb-5">
                <table className="table table-bordered table-striped align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col" className="text-center">S.No</th>
                            <th scope="col">Product Name</th>
                            <th scope="col" className="text-center">Qty</th>
                            <th scope="col" className="text-end">Unit Price (₹)</th>
                            <th scope="col" className="text-end">Discount (%)</th>
                            <th scope="col" className="text-end">Net Price (₹)</th>
                            <th scope="col" className="text-end">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.vendorOrders && orderDetails.vendorOrders.map((vendorOrder, vIndex) => (
                            vendorOrder.orderItems && vendorOrder.orderItems.map((item, iIndex) => {
                                const unitPrice = item.price;
                                const netPrice = unitPrice - (unitPrice * item.discount) / 100;
                                const rowTotal = netPrice * item.quantity;
                                return (
                                    <tr key={item._id}>
                                        <td className="text-center">{vIndex + 1}.{iIndex + 1}</td>
                                        <td>
                                            <div className="fw-bold">{item.plantName}</div>
                                            <small className="text-muted">Vendor: {vendorOrder.nurseryName || "Nursery"}</small>
                                        </td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-end">{unitPrice.toFixed(2)}</td>
                                        <td className="text-end text-success">{item.discount}%</td>
                                        <td className="text-end">{netPrice.toFixed(2)}</td>
                                        <td className="text-end fw-bold">{rowTotal.toFixed(2)}</td>
                                    </tr>
                                )
                            })
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invoice Summary */}
            <div className="row justify-content-end mb-5">
                <div className="col-sm-6 col-md-5 col-lg-4">
                    <table className="table table-borderless table-sm mb-0">
                        <tbody>
                            <tr>
                                <td className="text-end">Subtotal:</td>
                                <td className="text-end fw-bold">₹{orderDetails.pricing.totalPriceWithoutDiscount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="text-end text-success">Total Discount:</td>
                                <td className="text-end fw-bold text-success">-₹{orderDetails.pricing.totalDiscount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="text-end">Delivery Fee:</td>
                                <td className="text-end fw-bold">₹{orderDetails.pricing.deliveryFee.toFixed(2)}</td>
                            </tr>
                            <tr className="border-top">
                                <td className="text-end fs-5 pt-2"><strong>Grand Total:</strong></td>
                                <td className="text-end fs-5 pt-2"><strong>₹{orderDetails.pricing.finalPrice.toFixed(2)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center border-top pt-4">
                <p className="fw-bold mb-1">Thank you for your business!</p>
                <small className="text-muted">
                    This is a computer-generated invoice and does not require a physical signature. 
                    If you have any questions concerning this invoice, contact our support.
                </small>
            </div>
        </div>
    );
};

export default Invoice;
