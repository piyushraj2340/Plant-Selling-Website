import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, message, Popconfirm, Input, Row, Col } from 'antd';
import { nurseryOrdersAsync, nurseryUpdateOrderStatusAsync, nurseryBulkUpdateOrderStatusAsync } from '../nurserySlice';
import { useTableParams } from '../../../hooks/useTableParams';

const NurseryOrders = () => {
    const dispatch = useDispatch();
    const { ordersData, isLoading } = useSelector(state => state.nursery);
    const ordersTotal = useSelector(state => state.nursery.ordersData.total) || 0;
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const { tableParams, localSearch, handleTableChange, handleSearchChange, searchParams, fetchData } = useTableParams(nurseryOrdersAsync);

    useEffect(() => {
        if (ordersData?.data && ordersData.data.length > 0) {
            const rows = ordersData.data.map(vendorOrder => ({
                key: vendorOrder._id,
                vendorOrderId: vendorOrder._id,
                orderId: vendorOrder.order?._id,
                customerName: vendorOrder.order?.user?.name || 'Unknown',
                totalItems: vendorOrder.orderItems?.length || 0,
                subTotal: `₹${vendorOrder.pricing?.subTotal || 0}`,
                tag: vendorOrder.orderStatus?.status || 'Processing',
                status: vendorOrder.orderStatus?.message || 'Order is processing',
                action: vendorOrder.orderStatus?.status || 'Processing',
                orderItems: vendorOrder.orderItems || []
            }));
            setDataSource(rows);
        } else {
            setDataSource([]);
        }
    }, [ordersData]);

    const handleUpdateStatus = async (vendorOrderId, status, statusMessage) => {
        try {
            const res = await dispatch(nurseryUpdateOrderStatusAsync({ id: vendorOrderId, status, message: statusMessage })).unwrap();
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
            const selectedVendorOrderIds = selectedRowKeys;
            const res = await dispatch(nurseryBulkUpdateOrderStatusAsync({ ids: selectedVendorOrderIds, status, message: statusMessage })).unwrap();
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
            title: 'Vendor Order ID',
            dataIndex: 'vendorOrderId',
            key: 'vendorOrderId',
            render: (text) => <span className="fw-bold">{text}</span>
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Items',
            dataIndex: 'totalItems',
            key: 'totalItems',
        },
        {
            title: 'SubTotal',
            dataIndex: 'subTotal',
            key: 'subTotal',
        },
        {
            title: "Status",
            dataIndex: 'tag',
            key: 'tag',
            filters: [
                { text: 'Processing', value: 'processing' },
                { text: 'Approved', value: 'approved' },
                { text: 'Dispatched', value: 'dispatched' },
                { text: 'Delivered', value: 'delivered' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            filteredValue: searchParams.get('tag') ? searchParams.get('tag').split(',') : null,
            render: (_, { tag }) => {
                let color = 'geekblue';
                if (tag.toLowerCase() === 'processing') {
                    color = 'volcano'
                } else if (tag.toLowerCase() === 'approved' || tag.toLowerCase() === 'dispatched') {
                    color = 'blue'
                } else if (tag.toLowerCase() === 'delivered') {
                    color = 'green'
                } else if (tag.toLowerCase() === 'cancelled') {
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
            title: 'Message',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const action = record.action || 'processing';
                return (
                    <Space size={'small'}>
                        {action.toLowerCase() === 'approved' && (
                            <Popconfirm title="Mark as Dispatched?" onConfirm={() => handleUpdateStatus(record.vendorOrderId, 'Dispatched', 'Order Dispatched')}>
                                <button className='btn btn-sm btn-primary py-1 px-2 text-white' style={{ fontSize: "12px" }}>Dispatch</button>
                            </Popconfirm>
                        )}
                        {action.toLowerCase() === 'dispatched' && (
                            <Popconfirm title="Mark as Delivered?" onConfirm={() => handleUpdateStatus(record.vendorOrderId, 'Delivered', 'Order Delivered')}>
                                <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Deliver</button>
                            </Popconfirm>
                        )}
                    </Space>
                )
            }
        },
    ];

    const expandedRowRender = (record) => {
        const itemColumns = [
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

        return <Table columns={itemColumns} dataSource={record.orderItems.map(item => ({ ...item, key: item._id }))} pagination={false} />;
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="w-100 p-3 bg-white rounded shadow-sm">
            <Row justify="space-between" align="middle" className="mb-4">
                <div className="head">
                    <h5 className='h5 fw-bolder mb-0'>Manage Orders</h5>
                    <p className='text-muted small'>View and update order fulfillment statuses.</p>
                </div>
                <Col xs={24} md={8}>
                    <Input
                        placeholder="Search by Vendor Order ID or Plant Name..."
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
                    <Popconfirm title={`Dispatch ${selectedRowKeys.length} selected orders?`} onConfirm={() => handleBulkUpdateStatus('Dispatched', 'Orders Dispatched')}>
                        <button className="btn btn-sm btn-primary py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Dispatch</button>
                    </Popconfirm>
                    <Popconfirm title={`Deliver ${selectedRowKeys.length} selected orders?`} onConfirm={() => handleBulkUpdateStatus('Delivered', 'Orders Delivered')}>
                        <button className="btn btn-sm btn-success py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Deliver</button>
                    </Popconfirm>
                </div>
            )}
            
            <Table
                rowSelection={rowSelection}
                loading={isLoading}
                dataSource={dataSource}
                columns={columns}
                expandable={{ expandedRowRender }}
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
    );
};

export default NurseryOrders;
