import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message, Space, Card, Row, Col } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import JoditEditor from 'jodit-react';
import handelDataFetch from '../../../utils/handelDataFetch';

const { Option } = Select;

// Helper to generate a valid MongoDB ObjectId hex string in frontend
const generateObjectId = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const objectId = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    }).toLowerCase();
    return objectId;
};

const PlantFormModal = ({ isOpen, onClose, onSubmit, onRefresh, initialData, mode, categories, nurseries, loading }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [descFileList, setDescFileList] = useState([]);
    const [tempId, setTempId] = useState('');
    const quillRef = useRef(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
                setTempId(generateObjectId());
            }
        }
    }, [isOpen, initialData, mode, form]);

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(0, 3));
    };

    const handleDescUploadChange = ({ fileList: newFileList }) => {
        setDescFileList(newFileList.slice(0, 5));
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/avif';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG/WEBP/AVIF files!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
        }
        return false; // Prevent auto upload
    };

    const uploadDescImageCustomRequest = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;

        const currentPlantId = (mode === 'edit' && initialData) ? initialData._id : tempId;
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await handelDataFetch(`/api/v2/nursery/plants/${currentPlantId}/description-image`, 'POST', formData);
            if (res && res.data && res.data.status) {
                file.url = res.data.url; // Append url to file object so it can be used in gallery
                onSuccess("ok");
                message.success('Description image uploaded successfully!');

                // Update file list with new url
                setDescFileList(prev => prev.map(f => {
                    if (f.uid === file.uid) {
                        return { ...f, status: 'done', url: res.data.url };
                    }
                    return f;
                }));
            } else {
                throw new Error((res && res.data && res.data.message) || 'Upload failed');
            }
        } catch (error) {
            onError(error);
            message.error('Failed to upload description image.');
        }
    };

    const handleRemoveImage = async (file) => {
        if (!file.url) return true;
        
        const currentPlantId = (mode === 'edit' && initialData) ? initialData._id : tempId;
        if (!currentPlantId) return true;

        try {
            const res = await handelDataFetch(`/api/v2/nursery/plants/${currentPlantId}/image`, 'PATCH', { public_id: file.uid });
            if (res && res.data && res.data.status) {
                message.success('Image deleted successfully');
                setFileList(prev => prev.filter(f => f.uid !== file.uid));
                setDescFileList(prev => prev.filter(f => f.uid !== file.uid));
                if (onRefresh) onRefresh();
                return true;
            } else {
                message.error('Failed to delete image');
                return false;
            }
        } catch (error) {
            message.error('Failed to delete image');
            return false;
        }
    };

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Enter description...',
        height: 300,
        toolbarSticky: false,
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', 'eraser', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', 'paragraph', '|',
            'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'fullsize'
        ]
    }), []);

    const insertImageIntoEditor = (url) => {
        const currentDesc = form.getFieldValue('description') || '';
        form.setFieldsValue({ description: currentDesc + `<p><img src="${url}"/></p>` });
        setIsGalleryOpen(false);
    };

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

            if (mode === 'add' && tempId) {
                formData.append('_id', tempId);
            }

            // Append main files
            const newFiles = fileList.filter(file => file.originFileObj);
            newFiles.forEach((file, index) => {
                formData.append(`image_${index}`, file.originFileObj);
            });

            const existingImages = fileList.filter(file => !file.originFileObj && file.url).map(f => ({
                public_id: f.uid,
                url: f.url
            }));
            formData.append('existingImagesUrls', JSON.stringify(existingImages));

            const descImageUrls = descFileList.filter(f => f.url).map(f => ({
                public_id: f.uid,
                url: f.url
            }));
            formData.append('descriptionImagesUrls', JSON.stringify(descImageUrls));

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

                <div className="d-flex justify-content-between align-items-end mb-2">
                    <label className="mb-0" style={{ fontWeight: 500 }}>Description</label>
                    <Button
                        type="dashed"
                        size="small"
                        icon={<PictureOutlined />}
                        onClick={() => setIsGalleryOpen(true)}
                    >
                        Insert Image from Gallery
                    </Button>
                </div>
                <Form.Item
                    name="description"
                    rules={[{ required: true, message: 'Please enter plant description' }]}
                    getValueFromEvent={(content) => content}
                >
                    <JoditEditor config={config} tabIndex={1} />
                </Form.Item>

                <div className="row">
                    <div className="col-md-6">
                        <Form.Item label="Main Plant Images (Max 3)">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={beforeUpload}
                                onRemove={handleRemoveImage}
                                maxCount={3}
                                accept="image/png, image/jpeg, image/webp, image/avif"
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
                                customRequest={uploadDescImageCustomRequest}
                                onRemove={handleRemoveImage}
                                maxCount={5}
                                accept="image/png, image/jpeg, image/webp, image/avif"
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
            </Form>

            {/* Gallery Modal */}
            <Modal
                title="Insert from Description Media"
                open={isGalleryOpen}
                onCancel={() => setIsGalleryOpen(false)}
                footer={null}
                width={500}
            >
                {descFileList.filter(f => f.url).length === 0 ? (
                    <p className="text-center text-muted my-4">No images uploaded to Description Media yet.</p>
                ) : (
                    <Row gutter={[16, 16]}>
                        {descFileList.filter(f => f.url).map((file, idx) => (
                            <Col span={8} key={idx}>
                                <Card
                                    hoverable
                                    cover={<img alt="gallery" src={file.url} style={{ height: '100px', objectFit: 'cover' }} />}
                                    onClick={() => insertImageIntoEditor(file.url)}
                                    bodyStyle={{ padding: '8px', textAlign: 'center' }}
                                >
                                    <span style={{ fontSize: '12px', color: '#1890ff' }}>Click to Insert</span>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Modal>
        </Modal>
    );
};

export default PlantFormModal;

