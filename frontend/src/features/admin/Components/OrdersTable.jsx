import React from 'react'

import { Table, Tag, Space } from 'antd';

{/* Add Rating, Review into the component */}
const OrdersTable = () => {
  const dataSource = [
    {
      key: '1',
      products: {
        productName: "PlantRose",
        description: "lorem ipsum dolor sit amet, consectetur adip",
        imgLink: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
        link: "/rose",
      },
      sale: 32,
      stock: 120,
      amount: `₹${6313.21}`,
      tag: "completed",
      status: "Products Delivered",
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
      stock: 101,
      amount: `₹${2999.82}`,
      tag: "pending",
      status: "Prepare to dispatch",
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
      stock: 101,
      amount: `₹${2999.82}`,
      tag: "in-transit",
      status: "Product is waiting for the delivered",
      action: 'in-transit',
    },
  ];

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'products',
      key: 'products',
      fixed: "left",
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
    },
    {
      title: 'Sale',
      dataIndex: 'sale',
      key: 'sale',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: "Tag",
      dataIndex: 'tag',
      key: 'tag',
      render: (_, { tag }) => {

        let color;

        if (tag.toLowerCase() === 'pending') {
          color = 'volcano'
        } else if (tag.toLowerCase() === 'completed') {
          color = 'green'
        } else {
          color = 'geekblue';
        }

        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, { action }) => {
        if(action.toLowerCase() === 'pending')
        return (
          <Space size={'small'}>
            <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{fontSize: "12px"}}>Accepted</button>
            <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{fontSize: "12px"}}>Reject</button>
          </Space>
        )
      }
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{
        position: ['bottomCenter'],
        pageSize: 20,
      }}
      className='overflow-x-auto'
    />
  )
}


export default OrdersTable