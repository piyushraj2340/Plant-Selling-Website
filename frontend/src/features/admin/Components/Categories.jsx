import React, { useEffect, useState } from 'react';
import { Modal, Table, Space, Tag, Button, Form, Input, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategoriesAsync, createCategoryAsync, updateCategoryAsync, deleteCategoryAsync } from '../../category/categorySlice';

const { Option } = Select;

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, isLoading } = useSelector(state => state.category);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllCategoriesAsync({ status: filterStatus }));
    }, [dispatch, filterStatus]);

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
            dispatch(getAllCategoriesAsync({ status: filterStatus }));
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
                    dispatch(getAllCategoriesAsync({ status: filterStatus }));
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
        <div className='p-4 bg-white rounded shadow-sm'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h4 className='m-0'>Manage Categories</h4>
                <div className='d-flex gap-3 align-items-center'>
                    <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
                        <Option value='All'>All Status</Option>
                        <Option value='Active'>Active</Option>
                        <Option value='Pending'>Pending</Option>
                        <Option value='Disabled'>Disabled</Option>
                    </Select>
                    <Button type='primary' onClick={() => showModal()}>Add New Category</Button>
                </div>
            </div>
            <Table 
                columns={columns} 
                dataSource={categories} 
                rowKey='_id' 
                loading={isLoading} 
                pagination={{ pageSize: 10 }}
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
