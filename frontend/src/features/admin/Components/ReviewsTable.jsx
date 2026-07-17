import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, message, Popconfirm } from 'antd';
import { Rating } from 'react-simple-star-rating';
import { adminUpdateReviewStatusAsync } from '../adminSlice';


const ReviewsTable = () => {
    const dispatch = useDispatch();
    const { reviewsData, isLoading } = useSelector(state => state.admin);
    const reviews = reviewsData?.reviews || [];
    const [dataSource, setDataSource] = useState([]);

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
                price: 'N/A', // Assuming price isn't stored in review, or you can populate it
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
                    <Space size={'small'} className='mb-1'>
                        <Tag key={tag}>
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
                console.log(value);
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
                                    <i className='material-symbols-outlined me-1' style={{ fontSize: "14px" }}>check_circle</i> <span>Approve</span>
                                </button>
                            </Popconfirm>
                        )}
                        {record.status !== 'Rejected' && (
                            <Popconfirm
                                title="Reject this review?"
                                onConfirm={() => handleUpdateStatus(record.key, 'Rejected')}
                            >
                                <button className='btn btn-sm btn-danger py-1 px-2 text-white d-flex align-items-center justify-content-center' style={{ fontSize: "12px", width: "90px" }}>
                                    <i className='material-symbols-outlined me-1' style={{ fontSize: "14px" }}>cancel</i> <span>Reject</span>
                                </button>
                            </Popconfirm>
                        )}
                    </div>
                )
            },
            width: 150
        },
    ];
    return (
        <Table
            loading={isLoading}
            columns={columns}
            dataSource={dataSource}
            pagination={{
                position: ['bottomCenter'],
                pageSize: 20
            }}
            className='overflow-x-auto'
            scroll={{ x: 'max-content' }}
        />
    )
}

export default ReviewsTable