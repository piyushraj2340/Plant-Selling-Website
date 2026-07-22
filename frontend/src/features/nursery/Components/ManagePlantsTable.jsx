import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, message, Popconfirm, Input, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { nurseryPlantsAsync, nurseryPlantUpdateAsync, nurseryPlantDeleteAsync, addNewPlantsToNurseryAsync } from '../nurserySlice';
import { getAllCategoriesAsync } from '../../category/categorySlice';
import React, { useState, useEffect } from 'react';
import { useTableParams } from '../../../hooks/useTableParams';
import { useNavigate, Link } from 'react-router-dom';
import PlantFormModal from '../../common/Components/PlantFormModal';

const ManagePlantsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const plants = useSelector(state => state.nursery.plantsData.plants) || [];
    const plantsTotal = useSelector(state => state.nursery.plantsData.total) || 0;
    const isLoading = useSelector(state => state.nursery.isLoading);
    const { categories } = useSelector(state => state.category);
    const nursery = useSelector(state => state.nursery.nursery);
    
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedPlant, setSelectedPlant] = useState(null);

    useEffect(() => {
        dispatch(getAllCategoriesAsync({ status: 'Active' }));
    }, [dispatch]);

    const { tableParams, localSearch, handleTableChange, handleSearchChange, searchParams, fetchData } = useTableParams(nurseryPlantsAsync);

    const dataSource = plants.map((plant, index) => ({
        key: plant._id || index,
        products: {
            productName: plant.plantName,
            description: plant.description?.substring(0, 50) + "...",
            imgLink: plant.images && plant.images.length > 0 ? plant.images[0].url : "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
            link: `/product/${plant._id}`,
        },
        stock: plant.stock,
        price: plant.price,
        tags: plant.category ? [plant.category.categoryName || plant.category.name || (typeof plant.category === 'string' ? plant.category : 'Unknown')] : [],
        status: plant.status || "Draft",
        action: plant.status || "Draft",
    }));

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await dispatch(nurseryPlantUpdateAsync({ id, data: { status } })).unwrap();
            if (res.status) {
                message.success(res.message);
                fetchData();
            }
        } catch (error) {
            message.error("Failed to update plant status");
        }
    };

    const handleOpenModal = (mode, plant = null) => {
        setModalMode(mode);
        setSelectedPlant(plant);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlant(null);
    };

    const handleFormSubmit = async (formData, values) => {
        try {
            if (modalMode === 'add') {
                formData.append('user', nursery.user);
                formData.append('nursery', nursery._id);
                const res = await dispatch(addNewPlantsToNurseryAsync({ data: formData, redirect: null, navigate: null })).unwrap();
                if (res.result.status) {
                    message.success(res.result.message || "Plant added successfully!");
                    handleCloseModal();
                    fetchData();
                }
            } else {
                const res = await dispatch(nurseryPlantUpdateAsync({ id: selectedPlant._id, data: formData })).unwrap();
                if (res.status) {
                    message.success(res.message || "Plant updated successfully!");
                    handleCloseModal();
                    fetchData();
                }
            }
        } catch (error) {
            message.error(`Failed to ${modalMode} plant. ${error.message || ''}`);
        }
    };

    const handleDeletePlant = async (id) => {
        try {
            const res = await dispatch(nurseryPlantDeleteAsync(id)).unwrap();
            if (res.status) {
                message.success(res.message);
                fetchData();
            }
        } catch (error) {
            message.error("Failed to delete plant");
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
            title: 'Plant Name',
            dataIndex: 'products',
            key: 'products',
            fixed: "left",
            width: "25%",
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
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: true,
            render: (text) => `₹${text}`
        },
        {
            title: "Category",
            dataIndex: 'tags',
            key: 'tags',
            render: (tags) => {
                return tags.map(tag => (
                    <Tag key={tag}>
                        {tag.toUpperCase()}
                    </Tag>
                ));
            }
        },
        {
            title: "Status",
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Published', value: 'Published' },
                { text: 'Draft', value: 'Draft' },
                { text: 'On Hold', value: 'On Hold' },
            ],
            filteredValue: searchParams.get('status') ? searchParams.get('status').split(',') : null,
            render: (status) => {
                let color;
                if (status.toLowerCase() === 'published') {
                    color = 'green';
                } else if (status.toLowerCase() === 'on hold') {
                    color = 'geekblue';
                } else {
                    color = '';
                }
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const status = record.status;
                return (
                    <Space size={'small'}>
                        {
                            status.toLowerCase() !== 'published' &&
                            <Popconfirm title="Publish this plant?" onConfirm={() => handleUpdateStatus(record.key, 'Published')}>
                                <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Publish</button>
                            </Popconfirm>
                        }
                        {
                            status.toLowerCase() !== 'draft' &&
                            <Popconfirm title="Move this plant to draft?" onConfirm={() => handleUpdateStatus(record.key, 'Draft')}>
                                <button className='btn btn-sm btn-secondary py-1 px-2 text-white' style={{ fontSize: "12px" }}>Draft</button>
                            </Popconfirm>
                        }
                        
                        <button onClick={() => handleOpenModal('edit', plants.find(p => p._id === record.key))} className='btn btn-sm btn-primary py-1 px-2 text-white' style={{ fontSize: "12px" }}>Edit</button>
                        
                        <Popconfirm title="Delete this plant?" onConfirm={() => handleDeletePlant(record.key)}>
                            <button className='btn btn-sm btn-danger py-1 px-2 text-white' style={{ fontSize: "12px" }}>Delete</button>
                        </Popconfirm>
                    </Space>
                )
            }
        },
    ];

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="w-100">
            <Row justify="space-between" align="middle" className="mb-4 mx-3 my-3">
                <Col>
                    <div className="head d-flex align-items-center gap-3">
                        <h5 className='h5 fw-bolder m-0'>Manage Your Plants</h5>
                        <Button type="primary" style={{minWidth: "120px"}} icon={<PlusOutlined />} onClick={() => handleOpenModal('add')}>
                            Add Plant
                        </Button>
                    </div>
                </Col>
                <Col xs={24} md={8} className="mt-3 mt-md-0">
                    <Input
                        placeholder="Search plants..."
                        allowClear
                        prefix={<span role="img" aria-label="search">🔍</span>}
                        value={localSearch}
                        onChange={handleSearchChange}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>

            <div className="table-responsive px-3">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        ...tableParams.pagination,
                        total: plantsTotal,
                        showSizeChanger: true,
                    }}
                    onChange={handleTableChange}
                    loading={isLoading}
                    scroll={{ x: 1000 }}
                />
            </div>

            <PlantFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialData={selectedPlant}
                mode={modalMode}
                categories={categories}
                loading={isLoading}
            />
        </div>
    );
};

export default ManagePlantsTable;
