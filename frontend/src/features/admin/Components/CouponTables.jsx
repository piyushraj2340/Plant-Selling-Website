import React, { useState } from 'react';
import { Table, Space, Modal } from 'antd';


const CouponTables = ({showTermsModalOpen}) => {
    const dataSource = [
        {
            key: '1',
            couponName: "FIRST25",
            description: {
                overview: "Unlock a fantastic 25% discount, up to 100 Rupees, on your first purchase when you place an order totaling 149 Rupees or more. This special offer is designed exclusively for our valued first-time users, giving you extra savings on top of our already amazing deals",
                termsAndConditions: ["Valid for first-time users only.", "Minimum order value of 149 Rupees required.", "Maximum discount capped at 100 Rupees.", "Use code FIRST25 at checkout.", "Limited time offer, subject to availability", "Not applicable with other promotions or discounts.", "The company reserves the right to modify or terminate the offer at any time."]
            },
            discount: "25%",
            createdAt: '12:00:00 UTC 1st January 2024',
            redeemBefore: '12:00:00 UTC 1st January 2025',
            redemptionLimit: "1",
            action: 'publish'
        },
        {
            key: '2',
            couponName: "FIRST25",
            description: {
                overview: "Unlock a fantastic 25% discount, up to 100 Rupees, on your first purchase when you place an order totaling 149 Rupees or more. This special offer is designed exclusively for our valued first-time users, giving you extra savings on top of our already amazing deals",
                termsAndConditions: ["Valid for first-time users only.", "Minimum order value of 149 Rupees required.", "Maximum discount capped at 100 Rupees.", "Use code FIRST25 at checkout.", "Limited time offer, subject to availability", "Not applicable with other promotions or discounts.", "The company reserves the right to modify or terminate the offer at any time."]
            },
            discount: "25%",
            createdAt: '12:00:00 UTC 1st January 2024',
            redeemBefore: '12:00:00 UTC 1st January 2025',
            redemptionLimit: "1",
            action: 'draft'
        },
        {
            key: '3',
            couponName: "FIRST25",
            description: {
                overview: "Unlock a fantastic 25% discount, up to 100 Rupees, on your first purchase when you place an order totaling 149 Rupees or more. This special offer is designed exclusively for our valued first-time users, giving you extra savings on top of our already amazing deals",
                termsAndConditions: ["Valid for first-time users only.", "Minimum order value of 149 Rupees required.", "Maximum discount capped at 100 Rupees.", "Use code FIRST25 at checkout.", "Limited time offer, subject to availability", "Not applicable with other promotions or discounts.", "The company reserves the right to modify or terminate the offer at any time."]
            },
            discount: "25%",
            createdAt: '12:00:00 UTC 1st January 2024',
            redeemBefore: '12:00:00 UTC 1st January 2025',
            redemptionLimit: "1",
            action: 'draft'
        }
    ];

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
            dataIndex: 'action',
            key: 'action',
            render: (action) => {
                return (
                    <>
                        <Space size={'small'} className='mb-1'>
                            <button className='btn btn-sm btn-primary py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>edit</i> <span>Edit</span></button>
                        </Space>
                        <Space size={'small'} className='mb-1'>
                            <button className='btn btn-sm btn-danger py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>delete</i> <span>Delete</span></button>
                        </Space>

                        {
                            action.toLowerCase() !== 'draft' &&
                            <Space size={'small'} >
                                <button className='btn btn-sm btn-warning py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>draft</i> <span>Draft</span></button>
                            </Space>
                        }
                        {
                            action.toLowerCase() !== 'publish' &&
                            <Space size={'small'} >
                                <button className='btn btn-sm btn-warning py-1 px-2 text-white d-flex' style={{ fontSize: "12px", width: "75px" }}><i className='material-symbols-outlined' style={{ fontSize: "18px" }}>publish</i> <span>Publish</span></button>
                            </Space>
                        }
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