import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tag, Space, message, Popconfirm, Input, Row, Col } from 'antd';
import { adminUpdateOrderItemStatusAsync, adminBulkUpdateOrderItemStatusAsync, adminOrdersAsync } from '../adminSlice';
import { useTableParams } from '../../../hooks/useTableParams';

{/* Add Rating, Review into the component */ }
const OrdersTable = () => {
  const dispatch = useDispatch();
  const { ordersData, isLoading } = useSelector(state => state.admin);
  const ordersTotal = useSelector(state => state.admin.ordersData.total) || 0;
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { tableParams, localSearch, handleTableChange, handleSearchChange, searchParams, fetchData } = useTableParams(adminOrdersAsync);

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
            stock: item.plant?.stock !== undefined ? item.plant.stock : 'N/A',
            amount: `₹${item.price}`,
            tag: order.orderStatus?.status || 'pending',
            status: order.orderStatus?.message || 'Processing',
            action: order.orderStatus?.status || 'pending',
          });
        });
      });
      setDataSource(rows);
    } else {
      setDataSource([]);
    }
  }, [ordersData]);

  const handleUpdateStatus = async (key, status, statusMessage) => {
    try {
      const [orderId, itemId] = key.split('-');
      const res = await dispatch(adminUpdateOrderItemStatusAsync({ orderId, itemId, status, message: statusMessage })).unwrap();
      if (res.status) {
        message.success(res.message);
        fetchData();
      }
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleBulkUpdateStatus = async (status, statusMessage) => {
    try {
      const res = await dispatch(adminBulkUpdateOrderItemStatusAsync({ keys: selectedRowKeys, status, message: statusMessage })).unwrap();
      if (res.status) {
        message.success(res.message);
        setSelectedRowKeys([]);
        fetchData();
      }
    } catch (error) {
      message.error("Failed to perform bulk update");
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
      sorter: true,
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
      sorter: true,
    },
    {
      title: "Tag",
      dataIndex: 'tag',
      key: 'tag',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Placed', value: 'placed' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Completed', value: 'completed' },
        { text: 'Rejected', value: 'rejected' },
      ],
      filteredValue: searchParams.get('tag') ? searchParams.get('tag').split(',') : null,
      render: (_, { tag }) => {

        let color = 'geekblue';
        if (tag.toLowerCase() === 'pending') {
          color = 'volcano'
        } else if (tag.toLowerCase() === 'placed' || tag.toLowerCase() === 'delivered' || tag.toLowerCase() === 'completed') {
          color = 'green'
        } else if (tag.toLowerCase() === 'rejected') {
          color = 'red'
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
      filters: [
        { text: 'Processing', value: 'Processing' },
        { text: 'Order Accepted', value: 'Order Accepted' },
        { text: 'Order Delivered', value: 'Order Delivered' },
        { text: 'Order Rejected', value: 'Order Rejected' },
      ],
      filteredValue: searchParams.get('status') ? searchParams.get('status').split(',') : null,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const action = record.action || 'pending';
        return (
          <Space size={'small'}>
            {action.toLowerCase() === 'pending' && (
              <>
                <Popconfirm title="Accept this order?" onConfirm={() => handleUpdateStatus(record.key, 'placed', 'Order Accepted')}>
                  <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Accept</button>
                </Popconfirm>
                <Popconfirm title="Reject this order?" onConfirm={() => handleUpdateStatus(record.key, 'rejected', 'Order Rejected')}>
                  <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{ fontSize: "12px" }}>Reject</button>
                </Popconfirm>
              </>
            )}
            {action.toLowerCase() === 'placed' && (
              <Popconfirm title="Mark this order as Delivered?" onConfirm={() => handleUpdateStatus(record.key, 'delivered', 'Order Delivered')}>
                <button className='btn btn-sm btn-info py-1 px-2 text-white' style={{ fontSize: "12px" }}>Deliver</button>
              </Popconfirm>
            )}
          </Space>
        )
      }
    },
  ];

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="w-100">
      <Row justify="space-between" align="middle" className="mb-4 mx-3 my-3">
        <div className="head">
          <h5 className='h5 fw-bolder'>Orders </h5>
        </div>
        <Col xs={24} md={8}>
          <Input
            placeholder="Search by Order ID or Product..."
            allowClear
            prefix={<span role="img" aria-label="search">🔍</span>}
            value={localSearch}
            onChange={handleSearchChange}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {hasSelected && (
        <div className="d-flex align-items-center mb-3 p-3 bg-light border rounded gap-2">
          <span className="fw-bold me-2">{selectedRowKeys.length} items selected:</span>
          <Popconfirm title={`Accept ${selectedRowKeys.length} selected orders?`} onConfirm={() => handleBulkUpdateStatus('placed', 'Orders Accepted')}>
            <button className="btn btn-sm btn-success py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Accept</button>
          </Popconfirm>
          <Popconfirm title={`Reject ${selectedRowKeys.length} selected orders?`} onConfirm={() => handleBulkUpdateStatus('rejected', 'Orders Rejected')}>
            <button className="btn btn-sm btn-danger py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Reject</button>
          </Popconfirm>
          <Popconfirm title={`Mark ${selectedRowKeys.length} selected orders as Delivered?`} onConfirm={() => handleBulkUpdateStatus('delivered', 'Orders Delivered')}>
            <button className="btn btn-sm btn-info py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Deliver</button>
          </Popconfirm>
        </div>
      )}
      <Table
        rowSelection={rowSelection}
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          ...tableParams.pagination,
          total: ordersTotal,
          showSizeChanger: true,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
        className='overflow-x-auto'
      />
    </div>
  )
}

export default OrdersTable