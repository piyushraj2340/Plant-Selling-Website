import React, { useEffect } from 'react';
import { Table, Space, Tag, Popconfirm, Input, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { adminCouponsAsync, adminUpdateCouponStatusAsync, adminDeleteCouponAsync } from '../adminSlice';
import { useTableParams } from '../../../hooks/useTableParams';

const CouponTables = ({ showTermsModalOpen, onEditCoupon }) => {
    const dispatch = useDispatch();
    const { couponsData, isLoading } = useSelector(state => state.admin);
    const couponsTotal = useSelector(state => state.admin.couponsData?.total) || 0;

    const { tableParams, localSearch, handleTableChange, handleSearchChange, fetchData } = useTableParams(adminCouponsAsync);

    const handleStatusUpdate = (id, newStatus) => {
        dispatch(adminUpdateCouponStatusAsync({ id, status: newStatus })).then(() => fetchData());
    };

    const handleDelete = (id) => {
        dispatch(adminDeleteCouponAsync(id)).then(() => fetchData());
    };

    const dataSource = couponsData.coupons.map(coupon => ({
        key: coupon._id,
        _id: coupon._id,
        code: coupon.code,
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
        'rules.validUntil': new Date(coupon.rules.validUntil).toLocaleDateString(),
        redemptionLimit: coupon.usage.maxUsageCount ? `${coupon.usage.currentUsageCount}/${coupon.usage.maxUsageCount}` : 'Unlimited',
        status: coupon.status
    }));

    const columns = [
        {
            title: 'Coupon Name',
            dataIndex: 'code',
            key: 'code',
            sorter: true,
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
            sorter: true,
        },
        {
            title: 'Redeem Before',
            dataIndex: 'rules.validUntil',
            key: 'rules.validUntil',
            sorter: true,
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
            sorter: true,
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Expired', value: 'Expired' },
                { text: 'Disabled', value: 'Disabled' }
            ],
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
        <div className="w-100">
            <Row justify="space-between" align="middle" gutter={[16, 16]} className="mb-4">
                <Col xs={24} md={8}>
                    {/* Title can go here if needed */}
                </Col>
                <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <Input
                        placeholder="Search coupons..."
                        allowClear
                        prefix={<span role="img" aria-label="search">🔍</span>}
                        value={localSearch}
                        onChange={handleSearchChange}
                        style={{ width: '100%', maxWidth: '300px' }}
                    />
                </Col>
            </Row>

            <Table
                dataSource={dataSource}
                columns={columns}
                loading={isLoading}
                pagination={{
                    ...tableParams.pagination,
                    total: couponsTotal,
                    showSizeChanger: true,
                    position: ['bottomCenter']
                }}
                onChange={handleTableChange}
                className='overflow-x-auto'
            />
        </div>
    )
}

export default CouponTables