import React from 'react';
import { Table, Tag, Space } from 'antd';


const HelpTables = () => {
    const dataSource = [
        {
            key: '1',
            title: "Payment not received",
            categories: "Order -> Payment",
            description: "Product is delivered to the user and still I am not got the got the payment details",
            createdAt: '12:00:00 UTC 1st January 2024',
            status: 'Active',
            action: 'publish'
        },
        {
            key: '2',
            title: "Payment not received",
            categories: "Order -> Payment",
            description: "Product is delivered to the user and still I am not got the got the payment details",
            createdAt: '12:00:00 UTC 1st January 2024',
            status: 'Resolved',
            action: 'publish'
        },
        {
            key: '3',
            title: "Payment not received",
            categories: "Order -> Payment",
            description: "Product is delivered to the user and still I am not got the got the payment details",
            createdAt: '12:00:00 UTC 1st January 2024',
            status: 'Pending',
            action: 'publish'
        },
        {
            key: '3',
            title: "Payment not received",
            categories: "Order -> Payment",
            description: "Product is delivered to the user and still I am not got the got the payment details",
            createdAt: '12:00:00 UTC 1st January 2024',
            status: 'Closed',
            action: 'publish'
        },
    ];

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'categories',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Created At",
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: 'status',
            render: (status) => {

                let color;

                if(status.toLowerCase() === 'active') color = 'geekblue';
                else if(status.toLowerCase() === 'resolved') color = 'green';
                else if(status.toLowerCase() === 'pending') color = 'red';
                else if(status.toLowerCase() === 'closed') color = 'gray';
                else color = '';

                return (
                    <>
                        <Space size={'small'}>
                            <Tag color={color}>{status.toUpperCase()}</Tag>
                        </Space>
                    </>
                );
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (action) => {
                return (
                    <>
                        <Space size={'small'} className='mb-1'>
                            <button className='btn btn-sm btn-primary py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>chat</i> <span>Chat</span></button>
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

export default HelpTables