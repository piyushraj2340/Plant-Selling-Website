import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Tag, Space, message, Popconfirm, Row, Col, Input, Select } from 'antd';
import 'antd/dist/reset.css';
import { adminOrdersAsync, adminUpdateOrderItemStatusAsync, adminBulkUpdateOrderItemStatusAsync } from '../adminSlice';
import { useTableParams } from '../../../hooks/useTableParams';

const RecentOrder = () => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { ordersData, isLoading } = useSelector((state) => state.admin);
  const orders = ordersData?.data || [];

  const ordersTotal = useSelector((state) => state.admin.ordersData?.total) || 0;

  const { tableParams, localSearch, handleTableChange, handleSearchChange, searchParams, fetchData } = useTableParams(adminOrdersAsync);

  useEffect(() => {
    if (orders && orders.length > 0) {
      // Flatten order items into table rows through the vendorOrders hierarchy
      const rows = [];
      orders.forEach(order => {
        order.vendorOrders?.forEach(vendorOrder => {
          vendorOrder.orderItems?.forEach(item => {
            rows.push({
              key: `${vendorOrder._id}-${item._id}`,
              products: {
                productName: item.plantName,
                description: `Vendor Order ID: ${vendorOrder._id}`,
                imgLink: item.images?.url || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
                link: `/product/${item.plant?._id || item.plant}`,
              },
              sale: item.quantity,
              stock: item.plant?.stock !== undefined ? item.plant.stock : 'N/A',
              amount: `₹${item.price}`,
              tag: vendorOrder.orderStatus?.status || 'Processing',
              status: vendorOrder.orderStatus?.message || 'Order is processing',
              action: vendorOrder.orderStatus?.status || 'Processing',
            });
          });
        });
      });
      setTableData(rows);
    } else {
      setTableData([]);
    }
  }, [orders]);

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
              <img src={imgLink} alt="plants flowers" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
      sorter: (a, b) => a.sale - b.sale,
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
      sorter: (a, b) => {
        const amtA = parseFloat(a.amount.replace('₹', ''));
        const amtB = parseFloat(b.amount.replace('₹', ''));
        return amtA - amtB;
      }
    },
    {
      title: "Tag",
      dataIndex: 'tag',
      key: 'tag',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Placed', value: 'placed' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Rejected', value: 'rejected' },
      ],
      filteredValue: searchParams.get('tag') ? searchParams.get('tag').split(',') : null,
      render: (tag) => {

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
      <Row justify="end" className="mb-3">
        <Col xs={24} md={8}>
          <Input
            placeholder="Search Order ID..."
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
        dataSource={tableData}
        columns={columns}
        pagination={{
          ...tableParams.pagination,
          total: ordersTotal,
          showSizeChanger: true,
          position: ['bottomCenter'],
        }}
        onChange={handleTableChange}
        className='overflow-x-auto'
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default RecentOrder