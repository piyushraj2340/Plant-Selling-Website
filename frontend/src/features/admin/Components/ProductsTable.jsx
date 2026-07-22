import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, message, Popconfirm, Input, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { adminUpdatePlantStatusAsync, adminBulkUpdatePlantStatusAsync, adminProductsAsync, adminNurseriesAsync, adminAddPlantAsync, adminUpdatePlantAsync } from '../adminSlice';
import { getAllCategoriesAsync } from '../../category/categorySlice';
import React, { useState, useEffect } from 'react';
import PlantFormModal from '../../common/Components/PlantFormModal';
import { useTableParams } from '../../../hooks/useTableParams';

const ProductsTable = () => {
  const dispatch = useDispatch();
  const plants = useSelector(state => state.admin.productsData.plants) || [];
  const plantsTotal = useSelector(state => state.admin.productsData.total) || 0;
  const isLoading = useSelector(state => state.admin.isLoading);
  const nurseries = useSelector(state => state.admin.nurseriesList) || [];
  const { categories } = useSelector(state => state.category);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    dispatch(getAllCategoriesAsync({ status: 'Active' }));
    dispatch(adminNurseriesAsync());
  }, [dispatch]);

  const { tableParams, localSearch, handleTableChange, handleSearchChange, searchParams, fetchData } = useTableParams(adminProductsAsync);

  const dataSource = plants.map((plant, index) => ({
    key: plant._id || index,
    products: {
      productName: plant.plantName,
      description: plant.description?.substring(0, 50) + "...",
      imgLink: plant.images && plant.images.length > 0 ? plant.images[0].url : "https://upload.wikimedia.org/wikipedia/commons/c/ce/Emojione_1F331.svg",
      link: `/product/${plant._id}`,
    },
    stock: plant.stock,
    price: `₹${plant.price}`,
    tags: plant.category ? [plant.category.categoryName || plant.category.name || (typeof plant.category === 'string' ? plant.category : 'Unknown')] : [],
    status: plant.status || "Draft",
    action: plant.status || "Draft",
  }));

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await dispatch(adminUpdatePlantStatusAsync({ id, status })).unwrap();
      if (res.status) {
        message.success(res.message);
        fetchData();
      }
    } catch (error) {
      message.error("Failed to update product status");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      const res = await dispatch(adminBulkUpdatePlantStatusAsync({ ids: selectedRowKeys, status })).unwrap();
      if (res.status) {
        message.success(res.message);
        setSelectedRowKeys([]);
        fetchData();
      }
    } catch (error) {
      message.error("Failed to update bulk status");
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

  const handleFormSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        const res = await dispatch(adminAddPlantAsync(formData)).unwrap();
        if (res.status) {
          message.success(res.message || "Plant added successfully!");
          handleCloseModal();
          fetchData();
        }
      } else {
        const res = await dispatch(adminUpdatePlantAsync({ id: selectedPlant._id, data: formData })).unwrap();
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
    },
    {
      title: "Tags",
      dataIndex: 'tag',
      key: 'tag',
      filters: [
        { text: 'Flower', value: 'flower' },
        { text: 'Indoor Plants', value: 'indoor plants' },
        { text: 'Outdoor Plants', value: 'outdoor plants' },
      ],
      filteredValue: searchParams.get('tag') ? searchParams.get('tag').split(',') : null,
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
      filters: [
        { text: 'Published', value: 'Published' },
        { text: 'Draft', value: 'Draft' },
        { text: 'On Hold', value: 'On Hold' },
      ],
      filteredValue: searchParams.get('status') ? searchParams.get('status').split(',') : null,
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
      key: 'action',
      render: (_, record) => {
        const status = record.status;
        return (
          <Space size={'small'}>
            {
              status.toLowerCase() !== 'published' &&
              <Popconfirm title="Publish this product?" onConfirm={() => handleUpdateStatus(record.key, 'Published')}>
                <button className='btn btn-sm btn-success py-1 px-2 text-white' style={{ fontSize: "12px" }}>Publish</button>
              </Popconfirm>
            }
            {
              status.toLowerCase() !== 'draft' &&
              <Popconfirm title="Move this product to draft?" onConfirm={() => handleUpdateStatus(record.key, 'Draft')}>
                <button className='btn btn-sm btn-secondary py-1 px-2 text-white' style={{ fontSize: "12px" }}>Draft</button>
              </Popconfirm>
            }
            {
              status.toLowerCase() !== 'on hold' &&
              <Popconfirm title="Put this product on hold?" onConfirm={() => handleUpdateStatus(record.key, 'On Hold')}>
                <button className='btn btn-sm btn-info py-1 px-2 text-white' style={{ fontSize: "12px" }}>On Hold</button>
              </Popconfirm>
            }


            <button onClick={() => handleOpenModal('edit', plants.find(p => p._id === record.key))} className='btn btn-sm btn-primary py-1 px-2 text-white' style={{ fontSize: "12px" }}>Edit</button>
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
            <h5 className='h5 fw-bolder m-0'>Products</h5>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('add')}>
              Add New Plant
            </Button>
          </div>
        </Col>
        <Col xs={24} md={8} className="mt-3 mt-md-0">
          <Input
            placeholder="Search products..."
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
          <Popconfirm title={`Publish ${selectedRowKeys.length} selected products?`} onConfirm={() => handleBulkStatusUpdate('Published')}>
            <button className="btn btn-sm btn-success py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Publish</button>
          </Popconfirm>
          <Popconfirm title={`Move ${selectedRowKeys.length} selected products to draft?`} onConfirm={() => handleBulkStatusUpdate('Draft')}>
            <button className="btn btn-sm btn-secondary py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk Draft</button>
          </Popconfirm>
          <Popconfirm title={`Put ${selectedRowKeys.length} selected products on hold?`} onConfirm={() => handleBulkStatusUpdate('On Hold')}>
            <button className="btn btn-sm btn-info py-1 px-2 text-white" style={{ fontSize: "12px" }}>Bulk On Hold</button>
          </Popconfirm>
        </div>
      )}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={{
          ...tableParams.pagination,
          total: plantsTotal,
          showSizeChanger: true,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
        className='overflow-x-auto'
      />
      <PlantFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={selectedPlant}
        mode={modalMode}
        categories={categories}
        nurseries={nurseries}
        loading={isLoading}
      />
    </div>
  )
}

export default ProductsTable