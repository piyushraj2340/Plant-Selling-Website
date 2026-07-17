import React, { useEffect } from 'react';
import { Table, Space, Tag, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { adminCouponsAsync, adminUpdateCouponStatusAsync, adminDeleteCouponAsync } from '../adminSlice';

const CouponTables = ({ showTermsModalOpen, onEditCoupon }) => {
    const dispatch = useDispatch();
    const { couponsData, isLoading } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(adminCouponsAsync());
    }, [dispatch]);

    const handleStatusUpdate = (id, newStatus) => {
        dispatch(adminUpdateCouponStatusAsync({ id, status: newStatus }));
    };

    const handleDelete = (id) => {
        dispatch(adminDeleteCouponAsync(id));
    };

    const dataSource = couponsData.coupons.map(coupon => ({
        key: coupon._id,
        _id: coupon._id,
        couponName: coupon.code,
        description: {
            overview: coupon.description,
            termsAndConditions: [
                `Valid until: ${new Date(coupon.rules.validUntil).toLocaleDateString()}`,
                coupon.rules.minOrderAmount ? `Minimum order amount: ₹${coupon.rules.minOrderAmount}` : 'No minimum order required',
                coupon.rules.freeDelivery ? 'Includes free delivery' : null,
                coupon.rules.singleUsePerUser ? 'Single use per user' : null,
                coupon.rules.isNewUserOnly ? 'Valid for new users only' : null,
            ].filter(Boolean)
        },
        discount: coupon.discount.type === 'Percentage' ? `${coupon.discount.value}%` : `₹${coupon.discount.value}`,
        createdAt: new Date(coupon.createdAt).toLocaleDateString(),
        redeemBefore: new Date(coupon.rules.validUntil).toLocaleDateString(),
        redemptionLimit: coupon.usage.maxUsageCount ? `${coupon.usage.currentUsageCount}/${coupon.usage.maxUsageCount}` : 'Unlimited',
        status: coupon.status
    }));

    const columns = [
        {
            title: 'Coupon Name',
            dataIndex: 'couponName',
            key: 'couponName',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description) => {
                return (
                    <>
                        <p>{description.overview}. <b className='link-primary' style={{ cursor: 'pointer' }} onClick={() => showTermsModalOpen(description.termsAndConditions)}>T&C applied.</b></p>
                    </>
                )
            }
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: "Created At",
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Redeem Before',
            dataIndex: 'redeemBefore',
            key: 'redeemBefore',
        },
        {
            title: 'Redemption Limit',
            dataIndex: 'redemptionLimit',
            key: 'redemptionLimit',
        },
        {
            title: 'Action',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                return (
                    <>
                        <Space size={'small'} className='mb-1'>
                            <Tag color={status === 'Active' ? 'green' : status === 'Expired' ? 'red' : 'default'}>{status}</Tag>
                        </Space>
                        <br/>
                        {
                            status !== 'Disabled' && status !== 'Expired' &&
                            <Space size={'small'} className='mt-2'>
                                <Popconfirm title="Disable this coupon?" onConfirm={() => handleStatusUpdate(record._id, 'Disabled')}>
                                    <button className='btn btn-sm btn-warning py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><span>Disable</span></button>
                                </Popconfirm>
                            </Space>
                        }
                        {
                            status === 'Disabled' &&
                            <Space size={'small'} className='mt-2'>
                                <Popconfirm title="Activate this coupon?" onConfirm={() => handleStatusUpdate(record._id, 'Active')}>
                                    <button className='btn btn-sm btn-success py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><span>Activate</span></button>
                                </Popconfirm>
                            </Space>
                        }
                        <Space size={'small'} className='mt-2'>
                            <button className='btn btn-sm btn-info py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }} onClick={() => onEditCoupon(record._id)}><span>Edit</span></button>
                        </Space>
                        <Space size={'small'} className='mt-2'>
                            <Popconfirm title="Permanently delete this coupon?" onConfirm={() => handleDelete(record._id)}>
                                <button className='btn btn-sm btn-danger py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><span>Delete</span></button>
                            </Popconfirm>
                        </Space>
                    </>
                )
            },
            width: 150
        },
    ];

    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    position: ['bottomCenter'],
                    pageSize: 20,
                }}
                className='overflow-x-auto'
            />
        </>
    )
}

export default CouponTables