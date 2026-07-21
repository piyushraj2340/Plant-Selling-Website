import React, { useEffect, useState } from 'react';
import { Modal, Table, Space, Tag, Button, Form, Input, Select, message, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategoriesAsync, createCategoryAsync, updateCategoryAsync, deleteCategoryAsync } from '../../category/categorySlice';
import { useTableParams } from '../../../hooks/useTableParams';

const { Option } = Select;

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, total, isLoading } = useSelector(state => state.category);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    const { tableParams, localSearch, handleTableChange, handleSearchChange, fetchData } = useTableParams(getAllCategoriesAsync);
    const showModal = (category = null) => {
        setEditingCategory(category);
        if (category) {
            form.setFieldsValue({
                ...category,
                parentCategory: category.parentCategory?._id || undefined
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
        form.resetFields();
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        form.setFieldsValue({ slug });
    };

    const onFinish = async (values) => {
        try {
            if (editingCategory) {
                await dispatch(updateCategoryAsync({ id: editingCategory._id, data: values })).unwrap();
                message.success('Category updated successfully');
            } else {
                await dispatch(createCategoryAsync(values)).unwrap();
                message.success('Category created successfully');
            }
            setIsModalVisible(false);
            fetchData();
        } catch (error) {
            message.error(error.message || 'Action failed');
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
            onOk: async () => {
                try {
                    await dispatch(deleteCategoryAsync(id)).unwrap();
                    message.success('Category deleted successfully');
                    fetchData();
                } catch (error) {
                    message.error(error.message || 'Delete failed');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Parent',
            dataIndex: 'parentCategory',
            key: 'parentCategory',
            render: (parent) => parent ? parent.name : '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size='middle'>
                    <Button type='link' onClick={() => showModal(record)}>Edit</Button>
                    <Button type='link' danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </Space>
            ),
        },
    ];


    return (
        <div className="w-100 p-0">
            <Row justify="space-between" align="middle" gutter={[16, 16]} className="mb-4">
                <Col xs={24} md={8}>
                    <Button type="primary" onClick={() => showModal()}>
                        Add Category
                    </Button>
                </Col>
                <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <Input.Search
                        placeholder="Search categories..."
                        allowClear
                        value={localSearch}
                        onChange={handleSearchChange}
                        style={{ width: '100%', maxWidth: '300px' }}
                    />
                </Col>
            </Row>

            <Table 
                columns={columns} 
                dataSource={categories} 
                rowKey="_id" 
                loading={isLoading}
                pagination={{
                    ...tableParams.pagination,
                    total: total,
                    showSizeChanger: true,
                    position: ['bottomCenter']
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
            <Modal
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout='vertical' form={form} onFinish={onFinish}>
                    <Form.Item name='name' label='Category Name' rules={[{ required: true, message: 'Please enter category name' }]}>
                        <Input placeholder='Enter name (e.g. Flowering Plants)' onChange={handleNameChange} />
                    </Form.Item>
                    <Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Please enter slug' }]}>
                        <Input placeholder='Enter slug (e.g. flowering-plants)' />
                    </Form.Item>
                    <Form.Item name='description' label='Description'>
                        <Input.TextArea rows={3} placeholder='Enter description' />
                    </Form.Item>
                    <Form.Item name='parentCategory' label='Parent Category'>
                        <Select placeholder='Select a parent category' allowClear>
                            {categories.filter(c => !editingCategory || c._id !== editingCategory._id).map(cat => (
                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name='status' label='Status' rules={[{ required: true }]}>
                        <Select>
                            <Option value='Active'>Active</Option>
                            <Option value='Pending'>Pending</Option>
                            <Option value='Disabled'>Disabled</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className='text-end m-0'>
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type='primary' htmlType='submit'>Save</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Categories;
