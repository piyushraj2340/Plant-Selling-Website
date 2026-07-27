import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const PlantFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, categories, nurseries, loading }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [descFileList, setDescFileList] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                form.setFieldsValue({
                    plantName: initialData.plantName,
                    price: initialData.price,
                    discount: initialData.discount,
                    stock: initialData.stock,
                    category: typeof initialData.category === 'object' ? initialData.category?._id : initialData.category,
                    status: initialData.status,
                    description: initialData.description,
                    nursery: initialData.nursery?._id || initialData.nursery
                });

                // Set existing images
                if (initialData.images && initialData.images.length > 0) {
                    setFileList(initialData.images.map((img, index) => ({
                        uid: img.public_id || index.toString(),
                        name: `image-${index}.png`,
                        status: 'done',
                        url: img.url,
                    })));
                } else {
                    setFileList([]);
                }

                // Set existing description images
                if (initialData.descriptionImages && initialData.descriptionImages.length > 0) {
                    setDescFileList(initialData.descriptionImages.map((img, index) => ({
                        uid: img.public_id || index.toString(),
                        name: `desc-image-${index}.png`,
                        status: 'done',
                        url: img.url,
                    })));
                } else {
                    setDescFileList([]);
                }
            } else {
                form.resetFields();
                setFileList([]);
                setDescFileList([]);
            }
        }
    }, [isOpen, initialData, mode, form]);

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleDescUploadChange = ({ fileList: newFileList }) => {
        setDescFileList(newFileList);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG/WEBP files!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
        }
        return false; // Prevent auto upload
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link'], // Removed 'image' button as requested
                ['clean']
            ]
        }
    }), []);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append('plantName', values.plantName);
            formData.append('price', values.price);
            formData.append('discount', values.discount);
            formData.append('stock', values.stock);
            formData.append('category', values.category);
            formData.append('status', values.status);
            formData.append('description', values.description);

            if (values.nursery) {
                formData.append('nursery', values.nursery);
            }

            // Append main files
            const newFiles = fileList.filter(file => file.originFileObj);
            newFiles.forEach((file, index) => {
                formData.append(`image_${index}`, file.originFileObj);
            });

            // Append description files
            const newDescFiles = descFileList.filter(file => file.originFileObj);
            newDescFiles.forEach((file, index) => {
                formData.append(`descriptionImage_${index}`, file.originFileObj);
            });

            if (mode === 'add' && newFiles.length === 0) {
                message.error('Please upload at least one main image.');
                return;
            }

            onSubmit(formData, values);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={mode === 'add' ? 'Add New Plant' : 'Edit Plant'}
            open={isOpen}
            onOk={handleOk}
            onCancel={onClose}
            confirmLoading={loading}
            width={800}
            okText={mode === 'add' ? 'Add' : 'Save'}
        >
            <Form form={form} layout="vertical" initialValues={{ status: 'Draft' }}>
                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            name="plantName"
                            label="Plant Name"
                            rules={[{ required: true, message: 'Please enter plant name' }, { min: 3, max: 50, message: 'Length must be between 3 and 50 characters' }]}
                        >
                            <Input placeholder="Enter plant name" />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                        >
                            <Select placeholder="Select a category">
                                {categories && categories.map(cat => (
                                    <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <Form.Item
                            name="price"
                            label="Price (?)"
                            rules={[{ required: true, message: 'Please enter price' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item
                            name="discount"
                            label="Discount (%)"
                            rules={[{ required: true, message: 'Please enter discount' }]}
                        >
                            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="0" />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item
                            name="stock"
                            label="Stock"
                            rules={[{ required: true, message: 'Please enter stock quantity' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    {nurseries && nurseries.length > 0 && (
                        <div className="col-md-6">
                            <Form.Item
                                name="nursery"
                                label="Nursery"
                                rules={[{ required: true, message: 'Please select a nursery' }]}
                            >
                                <Select placeholder="Select a nursery (Admin only)" showSearch optionFilterProp="children">
                                    {nurseries.map(n => (
                                        <Option key={n._id} value={n._id}>{n.nurseryName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    )}
                    <div className={nurseries && nurseries.length > 0 ? "col-md-6" : "col-md-12"}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select>
                                <Option value="Draft">Draft</Option>
                                <Option value="Published">Published</Option>
                                <Option value="On Hold">On Hold</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter plant description' }]}
                    getValueFromEvent={(content) => content}
                >
                    <ReactQuill modules={modules} theme="snow" placeholder="Enter description..." style={{ height: '200px', marginBottom: '40px' }} />
                </Form.Item>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Item label="Main Plant Images (Max 3)">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={beforeUpload}
                                maxCount={3}
                                accept="image/png, image/jpeg, image/webp"
                            >
                                {fileList.length < 3 && (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item label="Description Media (Max 5)">
                            <Upload
                                listType="picture-card"
                                fileList={descFileList}
                                onChange={handleDescUploadChange}
                                beforeUpload={beforeUpload}
                                maxCount={5}
                                accept="image/png, image/jpeg, image/webp"
                            >
                                {descFileList.length < 5 && (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </div>
                </div>
                <small className="text-muted d-block mt-1">
                    Note: Existing images cannot be deleted in edit mode. New images uploaded will be appended.
                </small>
            </Form>
        </Modal>
    );
};

export default PlantFormModal;
