import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Radio, Select, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { nurseryStoreBlockAddAsync } from '../../nurserySlice';
import { getAllProductsAsync } from '../../../products/productsSlice';
import { getAllCategoriesAsync } from '../../../category/categorySlice';

const { Text } = Typography;
const { Option } = Select;

const AddBlocksModel = ({ isModelOpen, setIsModelOpen, atBlockIndex, setAtBlockIndex, setIsCurrentTemplates, isCurrentTab, isCurrentTemplates }) => {

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState(null);
    const [urlError, setUrlError] = useState("");
    const [linkType, setLinkType] = useState('custom');

    const fileInputRef = useRef(null);

    const dispatch = useDispatch();

    const nurseryId = useSelector(state => state.nursery.nursery?._id);
    const products = useSelector(state => state.products.products);
    const categories = useSelector(state => state.category.categories);

    useEffect(() => {
        if (isModelOpen && nurseryId) {
            dispatch(getAllProductsAsync({ nursery: nurseryId, limit: 100 }));
            dispatch(getAllCategoriesAsync());
        }
    }, [isModelOpen, nurseryId, dispatch]);

    const handleUrlChange = (e) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);

        if (linkType === 'custom') {
            // Check if the URL belongs to the same domain
            const currentDomain = window.location.origin;
            try {
                const newUrl = new URL(inputUrl, currentDomain);
                if (newUrl.origin !== currentDomain && !inputUrl.startsWith('/')) {
                    setUrlError("URL must be in the same domain.");
                } else {
                    setUrlError(""); // No error
                }
            } catch (error) {
                setUrlError("Invalid URL.");
            }
        } else {
            setUrlError("");
        }
    };

    const handleProductSelect = (value) => {
        setUrl(`/product/${value}`);
        setUrlError("");
    };

    const handleCategorySelect = (value) => {
        setUrl(`/nursery/store/view/${nurseryId}?activeTab=products&page=1&category=${value}`);
        setUrlError("");
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const resetCurrentState = () => {
        setTitle("");
        setUrl("");
        setImage(null);
        setLinkType('custom');
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; //? Reset the file input
        }
        setUrlError("");
        setIsCurrentTemplates(null);
        setAtBlockIndex(null);
        setIsModelOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!urlError) {
            // Submit form logic here

            const data = new FormData();
            data.append("image", image);
            data.append("nurseryStoreTabs", isCurrentTab);
            data.append("nurseryStoreTemplates", isCurrentTemplates);
            data.append("index", atBlockIndex);
            data.append("title", title);
            data.append("url", url);

            dispatch(nurseryStoreBlockAddAsync(data));

            resetCurrentState();
        }
    };

    return (
        <Modal
            title="Customize Your Store Page"
            centered
            open={isModelOpen}
            onOk={handleSubmit}
            onCancel={() => setIsModelOpen(false)}
            footer={
                [
                    <Button key="back" onClick={resetCurrentState}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>,
                ]
            }
        >
            <div className="container mt-5">
                <h3>Add New Content</h3>
                <form onSubmit={handleSubmit}>
                    {/* Title input */}
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            <span>Title </span>
                            <span className="text-danger small">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* URL input */}
                    <div className="mb-3">
                        <label className="form-label d-block">
                            <span>Add URL </span>
                            <span className="text-danger small">*</span>
                        </label>
                        <Text type="secondary" className="mb-2 d-block" style={{ fontSize: '13px' }}>
                            Choose whether to link to a specific product in your store, a product category, or provide a custom link.
                        </Text>
                        
                        <Radio.Group 
                            value={linkType} 
                            onChange={(e) => {
                                setLinkType(e.target.value);
                                setUrl(""); // Reset URL when switching types
                                setUrlError("");
                            }} 
                            className="mb-3"
                        >
                            <Radio.Button value="custom">Custom URL</Radio.Button>
                            <Radio.Button value="product">Product</Radio.Button>
                            <Radio.Button value="category">Category</Radio.Button>
                        </Radio.Group>

                        {linkType === 'custom' && (
                            <input
                                type="text"
                                className="form-control"
                                id="url"
                                placeholder="/path or https://yoursite.com/path"
                                value={url}
                                onChange={handleUrlChange}
                                required
                            />
                        )}

                        {linkType === 'product' && (
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Search and select a product"
                                optionFilterProp="children"
                                onChange={handleProductSelect}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={products?.map(p => ({ label: p.plantName, value: p._id })) || []}
                            />
                        )}

                        {linkType === 'category' && (
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="Search and select a category"
                                optionFilterProp="children"
                                onChange={handleCategorySelect}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={categories?.map(c => ({ label: c.name, value: c._id })) || []}
                            />
                        )}

                        {urlError && <div className="text-danger mt-1">{urlError}</div>}
                        
                        {/* Hidden input to ensure HTML validation if Select is empty */}
                        {linkType !== 'custom' && (
                            <input type="text" value={url} required style={{ opacity: 0, height: 0, padding: 0, margin: 0, position: 'absolute' }} onChange={()=>{}} />
                        )}
                    </div>

                    {/* Image upload */}
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                            <span>Upload Image </span>
                            <span className="text-danger small">*</span>
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="form-control"
                            id="image"
                            accept="image/png, image/jpeg"
                            onChange={handleImageUpload}
                            required
                        />


                    </div>


                </form>
            </div>
        </Modal>
    );
};
export default AddBlocksModel;