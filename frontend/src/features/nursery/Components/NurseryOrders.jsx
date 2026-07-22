import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, message, Popconfirm, Input, Row, Col } from 'antd';
import { nurseryOrdersAsync, nurseryUpdateOrderStatusAsync, nurseryBulkUpdateOrderStatusAsync } from '../../nurserySlice';
import { useTableParams } from '../../../../hooks/useTableParams';

const NurseryOrders = () => {
    const dispatch = useDispatch();
    const { ordersData, isLoading } = useSelector(state => state.nursery);
    const ordersTotal = useSelector(state => state.nursery.ordersData.total) || 0;
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const { tableParams, localSearch, handleTableChange, handleSearchChange, searchParams, fetchData } = useTableParams(nurseryOrdersAsync);

    useEffect(() => {
        if (ordersData?.data && ordersData.data.length > 0) {
            const rows = [];
            ordersData.data.forEach(order => {
                order.orderItems.forEach(item => {
                    rows.push({
                        key: item._id,
                        vendorOrderId: order._id,
                        orderId: order.order?._id,
                        customerName: order.order?.user?.name || 'Unknown',
                        products: {
                            productName: item.plantName,
                            description: `Order ID: ${order._id}`,
                            imgLink: item.images?.url || "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
                            link: `/product/${item.plant?._id || item.plant}`,
                        },
                        sale: item.quantity,
                        amount: `₹${item.price}`,
                        tag: order.orderStatus?.status || 'Processing',
                        status: order.orderStatus?.message || 'Order is processing',
                        action: order.orderStatus?.status || 'Processing',
                    });
                });
            });
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
            const selectedVendorOrderIds = [...new Set(dataSource.filter(row => selectedRowKeys.includes(row.key)).map(row => row.vendorOrderId))];
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
            title: 'Product',
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
                            <h6 className='h6 fw-bold text-black mb-0'>{productName}</h6>
                            <p className='text-secondary fw-lighter mb-0' style={{ fontSize: "12px" }}>{description}</p>
                        </div>
                    </a>
                );
            },
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Quantity',
            dataIndex: 'sale',
            key: 'sale',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'amount',
            key: 'amount',
            sorter: true,
        },
        {
            title: "Tag",
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
            title: 'Status Message',
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
