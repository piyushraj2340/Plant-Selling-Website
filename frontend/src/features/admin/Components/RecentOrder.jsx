import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Tag, Space, message } from 'antd';
import 'antd/dist/reset.css';
import { adminOrdersAsync } from '../adminSlice';

const RecentOrder = () => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const token = useSelector((state) => state.user.token);
  const { orders, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (token) {
        dispatch(adminOrdersAsync());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      // Flatten order items into table rows
      const rows = [];
      orders.forEach(order => {
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
      setTableData(rows.slice(0, 50)); // Show only latest 50 items
    }
  }, [orders]);

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
              <img  src={imgLink} alt="plants flowers" style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </div>
            <div className="d-flex flex-column ms-1 justify-content-start mt-1">
              <h6 className='h6 fw-bold text-black m-0'>{productName}</h6>
              <p className='text-secondary fw-lighter' style={{ fontSize: "11px" }}>{description}</p>
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
      render: (tag) => {

        let color = 'geekblue';
        if (tag.toLowerCase() === 'pending') {
          color = 'volcano'
        } else if (tag.toLowerCase() === 'delivered' || tag.toLowerCase() === 'completed') {
          color = 'green'
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
      render: (action) => {
        if(action.toLowerCase() === 'pending')
        return (
          <Space size={'small'}>
            <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{fontSize: "12px"}}>Accept</button>
            <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{fontSize: "12px"}}>Reject</button>
          </Space>
        )
      }
    },
  ];

  return (
    <Table
      loading={isLoading}
      dataSource={tableData}
      columns={columns}
      pagination={{
        position: ['bottomCenter'],
        pageSize: 10,
      }}
      className='overflow-x-auto'
    />
  )
}

export default RecentOrder