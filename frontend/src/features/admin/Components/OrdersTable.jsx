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
      const rows = ordersData.data.map(order => ({
        key: order._id,
        orderId: order._id,
        customerName: order.user?.name || 'Unknown',
        customerEmail: order.user?.email || 'N/A',
        totalAmount: `₹${order.pricing?.finalPrice || 0}`,
        orderDate: new Date(order.orderAt).toLocaleDateString(),
        status: order.overallStatus || 'Processing',
        vendorOrders: order.vendorOrders || []
      }));
      setDataSource(rows);
    } else {
      setDataSource([]);
    }
  }, [ordersData]);

  const handleUpdateStatus = async (vendorOrderId, status, statusMessage) => {
    try {
      const res = await dispatch(adminUpdateOrderItemStatusAsync({ id: vendorOrderId, status, message: statusMessage })).unwrap();
      if (res.status) {
        message.success(res.message);
        fetchData();
      }
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleGlobalUpdateStatus = async (orderId, status, statusMessage) => {
    try {
      const order = dataSource.find(o => o.orderId === orderId);
      if (!order) return;
      const vendorOrderIds = order.vendorOrders.map(vo => vo._id);
      if (vendorOrderIds.length === 0) return;
      
      const res = await dispatch(adminBulkUpdateOrderItemStatusAsync({ keys: vendorOrderIds, status, message: statusMessage })).unwrap();
      if (res.status) {
        message.success(`Global Order ${status}`);
        fetchData();
      }
    } catch (error) {
      message.error("Failed to update global order");
    }
  };

  const handleBulkUpdateStatus = async (status, statusMessage) => {
    try {
      let vendorOrderIds = [];
      dataSource.forEach(order => {
        if (selectedRowKeys.includes(order.key)) {
          vendorOrderIds = [...vendorOrderIds, ...order.vendorOrders.map(vo => vo._id)];
        }
      });
      if (vendorOrderIds.length === 0) return;

      const res = await dispatch(adminBulkUpdateOrderItemStatusAsync({ keys: vendorOrderIds, status, message: statusMessage })).unwrap();
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

  const rootColumns = [
    {
      title: 'Global Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <span className="fw-bold">{text}</span>
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div className="fw-bold">{record.customerName}</div>
          <div className="text-muted small">{record.customerEmail}</div>
        </div>
      )
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Overall Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'geekblue';
        if (status.toLowerCase() === 'processing') color = 'volcano';
        else if (status.toLowerCase() === 'delivered') color = 'green';
        else if (status.toLowerCase() === 'cancelled') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const action = record.status || 'Processing';
        return (
          <Space size={'small'}>
            {action.toLowerCase() === 'processing' && (
              <>
                <Popconfirm title="Approve ALL vendor orders?" onConfirm={() => handleGlobalUpdateStatus(record.orderId, 'Approved', 'Order Approved')}>
                  <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Approve All</button>
                </Popconfirm>
                <Popconfirm title="Cancel ALL vendor orders?" onConfirm={() => handleGlobalUpdateStatus(record.orderId, 'Cancelled', 'Order Cancelled')}>
                  <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{ fontSize: "12px" }}>Cancel All</button>
                </Popconfirm>
              </>
            )}
          </Space>
        )
      }
    }
  ];

  const vendorOrderColumns = [
    { title: 'Vendor Order ID', dataIndex: '_id', key: '_id' },
    { title: 'Nursery', key: 'nursery', render: (_, record) => record.nursery?.nurseryName || 'Unknown' },
    { title: 'Vendor Status', dataIndex: ['orderStatus', 'status'], key: 'status' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const action = record.orderStatus?.status || 'Processing';
        return (
          <Space size={'small'}>
            {action.toLowerCase() === 'processing' && (
              <>
                <Popconfirm title="Approve this vendor order?" onConfirm={() => handleUpdateStatus(record._id, 'Approved', 'Order Approved')}>
                  <button className='btn btn-sm btn-outline-success py-0 px-2' style={{ fontSize: "12px" }}>Approve</button>
                </Popconfirm>
                <Popconfirm title="Cancel this vendor order?" onConfirm={() => handleUpdateStatus(record._id, 'Cancelled', 'Order Cancelled')}>
                  <button className='btn btn-sm btn-outline-danger py-0 px-2' style={{ fontSize: "12px" }}>Cancel</button>
                </Popconfirm>
              </>
            )}
          </Space>
        )
      }
    }
  ];

  const orderItemColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, item) => (
        <div className='d-flex align-items-center'>
          <div style={{ width: "40px", height: "40px" }} className='border p-1 rounded me-2'>
            <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={item.images?.url || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg"} alt="plant" />
          </div>
          <a href={`/product/${item.plant?._id || item.plant}`} className='text-decoration-none text-dark fw-bold'>
            {item.plantName}
          </a>
        </div>
      )
    },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price', key: 'price', render: (_, item) => `₹${item.price}` }
  ];

  const expandedVendorOrderRender = (vendorOrder) => {
    return (
      <Table 
        columns={orderItemColumns} 
        dataSource={vendorOrder.orderItems?.map(item => ({...item, key: item._id})) || []} 
        pagination={false} 
        size="small" 
      />
    );
  };

  const expandedRootOrderRender = (order) => {
    return (
      <Table 
        columns={vendorOrderColumns} 
        dataSource={order.vendorOrders?.map(vo => ({...vo, key: vo._id})) || []} 
        expandable={{ expandedRowRender: expandedVendorOrderRender }}
        pagination={false} 
        size="middle" 
      />
    );
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="w-100 p-3 bg-white rounded shadow-sm">
      <Row justify="space-between" align="middle" className="mb-4">
        <div className="head">
          <h5 className='h5 fw-bolder'>Global Orders Overview</h5>
        </div>
        <Col xs={24} md={8}>
          <Input
            placeholder="Search by Order ID or User..."
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
          <Popconfirm title={`Approve all vendor orders in ${selectedRowKeys.length} selected global orders?`} onConfirm={() => handleBulkUpdateStatus('Approved', 'Orders Approved')}>
            <button className="btn btn-sm btn-success py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Approve</button>
          </Popconfirm>
          <Popconfirm title={`Cancel all vendor orders in ${selectedRowKeys.length} selected global orders?`} onConfirm={() => handleBulkUpdateStatus('Cancelled', 'Orders Cancelled')}>
            <button className="btn btn-sm btn-danger py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Cancel</button>
          </Popconfirm>
        </div>
      )}
      
      <Table
        rowSelection={rowSelection}
        loading={isLoading}
        dataSource={dataSource}
        columns={rootColumns}
        expandable={{ expandedRowRender: expandedRootOrderRender }}
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