import React from 'react'

import { Table, Tag, Space } from 'antd';

const ProductsTable = () => {
  const dataSource = [
    {
      key: '1',
      products: {
        productName: "PlantRose",
        description: "lorem ipsum dolor sit amet, consectetur adip",
        imgLink: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
        link: "/rose",
      },
      stock: 120,
      price: `₹${6313.21}`,
      tags: ["flower", "indore plants"],
      status: "Published",
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
      price: `₹${2999.82}`,
      tags: ["flower", "indore plants"],
      status: "Draft",
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
      price: `₹${2999.82}`,
      tags: ["flower", "indore plants"],
      status: "ON Hold",
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
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
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
          <Tag key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );
      }
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, { status }) => {
        return (
          <Space size={'small'}>
            {
              status.toLowerCase() !== 'published' &&
              <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Published</button>
            }
            {
              status.toLowerCase() !== 'draft' &&
              <button className='btn btn-sm btn-secondary py-1 px-2 text-white' style={{ fontSize: "12px" }}>Draft</button>
            }
            {
              status.toLowerCase() !== 'on hold' &&
              <button className='btn btn-sm btn-info py-1 px-2 text-white' style={{ fontSize: "12px" }}>On Hold</button>
            }


            <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{ fontSize: "12px" }}>Edit</button>
          </Space>
        )
      }
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
    />
  )
}

export default ProductsTable