import React from 'react';
import { Table, Tag, Space } from 'antd';
import { Rating } from 'react-simple-star-rating';


const ReviewsTable = () => {
    const dataSource = [
        {
            key: '1',
            products: {
                productName: "PlantRose",
                description: "lorem ipsum dolor sit amet, consectetur adip",
                imgLink: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
                link: "/rose",
            },
            price: `₹${6313.21}`,
            tags: ["flower", "indore plants"],
            status: "Published",
            rating: 4.3,
            reviews: "I recently added the Monstera Deliciosa to my indoor plant collection, and it's truly a showstopper. The iconic split leaves add a touch of elegance to any room.",
            action: 'completed',
        },
        {
            key: '2',
            products: {
                productName: "PlantLotus",
                description: "lorem ipsum dolor sit amet, consectetur adip",
                imgLink: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
                link: "/lotus",
            },
            sale: 42,
            price: `₹${2999.82}`,
            tags: ["flower", "indore plants"],
            status: "Draft",
            rating: 4.4,
            reviews: "I recently added the Monstera Deliciosa to my indoor plant collection, and it's truly a showstopper. The iconic split leaves add a touch of elegance to any room.",
            action: 'pending',
        },
        {
            key: '3',
            products: {
                productName: "PlantSunFlower",
                description: "lorem ipsum dolor sit amet, consectetur adip",
                imgLink: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
                link: "/sun-flower",
            },
            sale: 42,
            rating: 4.5,
            tags: ["flower", "indore plants"],
            status: "ON Hold",
            price: `₹${2999.82}`,
            reviews: "I recently added the Monstera Deliciosa to my indoor plant collection, and it's truly a showstopper. The iconic split leaves add a touch of elegance to any room.",
            action: 'in-transit',
        },
    ];

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'products',
            key: 'products',
            render: ({ productName, description, imgLink, link }) => {
                return (
                    <a href={link} className='d-flex text-decoration-none hover-product-name'>
                        <div style={{ width: "50px", height: "50px" }} className='border p-1 rounded me-1'>
                            <img src={imgLink} alt="plants flowers" />
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

                if (status.toLowerCase() === 'published') {
                    color = 'green'
                } else if (status.toLowerCase() === 'on hold') {
                    color = 'geekblue'
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
            dataIndex: 'action',
            key: 'action',
            render: () => {
                return (
                    <>
                        <Space size={'small'} className='mb-1'>
                            <button className='btn btn-sm btn-primary py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>reply</i> <span>Reply</span></button>
                        </Space>
                        <Space size={'small'} className='mb-1'>
                            <button className='btn btn-sm btn-danger py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>delete</i> <span>Delete</span></button>
                        </Space>
                        <Space size={'small'} >
                            <button className='btn btn-sm btn-warning py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>report</i> <span>Report</span></button>
                        </Space>
                    </>

                )
            },
            width: 150
        },
    ];
    return (
        <Table
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