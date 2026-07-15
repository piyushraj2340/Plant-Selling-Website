import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Tag, Space } from 'antd';

{/* Add Rating, Review into the component */ }
const OrdersTable = () => {
  const { ordersData, isLoading } = useSelector(state => state.admin);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (ordersData?.data && ordersData.data.length > 0) {
      const rows = [];
      ordersData.data.forEach(order => {
        order.orderItems.forEach(item => {
          rows.push({
            key: `${order._id}-${item._id}`,
            products: {
              productName: item.plantName,
              description: `Order ID: ${order._id}`,
              imgLink: item.images?.url || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
              link: `/product/${item.plant}`,
            },
            sale: item.quantity,
            stock: 'N/A', // Admin panel might need plant stock from populate later
            amount: `₹${item.price}`,
            tag: item.orderStatus?.status || 'pending',
            status: item.orderStatus?.message || 'Processing',
            action: item.orderStatus?.status || 'pending',
          });
        });
      });
      setDataSource(rows);
    } else {
      setDataSource([]);
    }
  }, [ordersData]);

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
              <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={imgLink} alt="plants flowers" />
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
        if (action.toLowerCase() === 'pending')
          return (
            <Space size={'small'}>
              <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Accepted</button>
              <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{ fontSize: "12px" }}>Reject</button>
            </Space>
          )
      }
    },
  ];

  return (
    <Table
      loading={isLoading}
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