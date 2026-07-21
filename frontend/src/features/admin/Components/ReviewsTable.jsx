import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, message, Popconfirm, Input, Row, Col } from 'antd';
import { Rating } from 'react-simple-star-rating';
import { adminUpdateReviewStatusAsync, adminBulkUpdateReviewStatusAsync, adminReviewsAsync } from '../adminSlice';
import { useTableParams } from '../../../hooks/useTableParams';


const ReviewsTable = () => {
    const dispatch = useDispatch();
    const { reviewsData, isLoading } = useSelector(state => state.admin);
    const reviews = reviewsData?.reviews || [];
    const reviewsTotal = useSelector(state => state.admin.reviewsData?.total) || 0;
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const { tableParams, localSearch, handleTableChange, handleSearchChange } = useTableParams(adminReviewsAsync);

    useEffect(() => {
        if (reviews && reviews.length > 0) {
            const data = reviews.map(review => ({
                key: review._id,
                products: {
                    productName: review.plant?.plantName || 'Unknown Plant',
                    description: `Reviewed by: ${review.user?.name || 'Unknown User'}`,
                    imgLink: review.plant?.images?.[0]?.url || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
                    link: `/product/${review.plant?._id}`,
                },
                price: review.plant?.price !== undefined ? `₹${(review.plant.price - (review.plant.price * (review.plant.discount || 0) / 100)).toFixed(2)}` : 'N/A',
                tags: review.plant?.category ? [review.plant.category] : [],
                status: review.status,
                rating: review.rating,
                reviews: review.review || 'No text provided.',
                action: review.status,
            }));
            setDataSource(data);
        } else {
            setDataSource([]);
        }
    }, [reviews]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await dispatch(adminUpdateReviewStatusAsync({ id, status })).unwrap();
            if (res.status) {
                message.success(res.message);
            }
        } catch (error) {
            message.error("Failed to update review status");
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        try {
            const res = await dispatch(adminBulkUpdateReviewStatusAsync({ ids: selectedRowKeys, status })).unwrap();
            if (res.status) {
                message.success(res.message);
                setSelectedRowKeys([]);
            }
        } catch (error) {
            message.error("Failed to update bulk review status");
        }
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'products',
            key: 'products',
            render: ({ productName, description, imgLink, link }) => {
                return (
                    <a href={link} className='d-flex text-decoration-none hover-product-name'>
                        <div style={{ width: "50px", height: "50px" }} className='border p-1 rounded me-1'>
                            <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={imgLink} alt="plants flowers" />
                        </div>
                        <div className="d-flex flex-column ms-1 justify-content-start mt-1">
                            <h6 className='h6 fw-bold text-black'>{productName}</h6>
                            <p className='text-secondary fw-lighter' style={{ fontSize: "12px" }}>{description}</p>
                        </div>
                    </a>
                );
            },
            width: 250
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: "Tags",
            dataIndex: 'tag',
            key: 'tag',
            render: (_, { tags }) => {

                return tags.map(tag =>
                    <Space size={'small'} className='mb-1' key={tag}>
                        <Tag>
                            {tag.toUpperCase()}
                        </Tag>
                    </Space>

                );
            },
            width: 150
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => {

                let color;

                if (status.toLowerCase() === 'approved') {
                    color = 'green'
                } else if (status.toLowerCase() === 'pending') {
                    color = 'geekblue'
                } else if (status.toLowerCase() === 'rejected') {
                    color = 'red';
                } else {
                    color = '';
                }

                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                )
            }
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: value => {
                return <Rating initialValue={value} size={20} readonly={true} allowFraction="true" />
            }
        },
        {
            title: 'Reviews',
            dataIndex: 'reviews',
            key: 'reviews',
            width: 500
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <div className="d-flex flex-column gap-1">
                        {record.status !== 'Approved' && (
                            <Popconfirm
                                title="Approve this review?"
                                onConfirm={() => handleUpdateStatus(record.key, 'Approved')}
                            >
                                <button className='btn btn-sm btn-success py-1 px-2 text-white d-flex align-items-center justify-content-center' style={{ fontSize: "12px", width: "90px" }}>
                                    <i className='fas fa-check-circle me-1' style={{ fontSize: "14px" }}></i> <span>Approve</span>
                                </button>
                            </Popconfirm>
                        )}
                        {record.status !== 'Rejected' && (
                            <Popconfirm
                                title="Reject this review?"
                                onConfirm={() => handleUpdateStatus(record.key, 'Rejected')}
                            >
                                <button className='btn btn-sm btn-danger py-1 px-2 text-white d-flex align-items-center justify-content-center' style={{ fontSize: "12px", width: "90px" }}>
                                    <i className='fas fa-times-circle me-1' style={{ fontSize: "14px" }}></i> <span>Reject</span>
                                </button>
                            </Popconfirm>
                        )}
                    </div>
                )
            },
            width: 150
        },
    ];

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="w-100 p-0">
            <Row justify="space-between" align="middle" gutter={[16, 16]} className="mb-4">
                <Col xs={24} md={8}>
                    {/* Title can go here if needed */}
                </Col>
                <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <Input.Search
                        placeholder="Search by review text or plant name..."
                        allowClear
                        value={localSearch}
                        onChange={handleSearchChange}
                        style={{ width: '100%', maxWidth: '300px' }}
                    />
                </Col>
            </Row>
            {hasSelected && (
                <div className="d-flex align-items-center mb-3 p-3 bg-light border rounded gap-2 w-100">
                    <span className="fw-bold me-2">{selectedRowKeys.length} items selected:</span>
                    <Popconfirm title={`Approve ${selectedRowKeys.length} selected reviews?`} onConfirm={() => handleBulkStatusUpdate('Approved')}>
                        <button className="btn btn-sm btn-success py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Approve</button>
                    </Popconfirm>
                    <Popconfirm title={`Reject ${selectedRowKeys.length} selected reviews?`} onConfirm={() => handleBulkStatusUpdate('Rejected')}>
                        <button className="btn btn-sm btn-danger py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Reject</button>
                    </Popconfirm>
                </div>
            )}
            <Table
                rowSelection={rowSelection}
                loading={isLoading}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    ...tableParams.pagination,
                    total: reviewsTotal,
                    showSizeChanger: true,
                    position: ['bottomCenter']
                }}
                onChange={handleTableChange}
                className='overflow-x-auto w-100'
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default ReviewsTable