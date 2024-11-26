import React, { useState, useRef } from 'react';
import { Button, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { nurseryStoreBlockAddAsync } from '../../nurserySlice';

const AddBlocksModel = ({ isModelOpen, setIsModelOpen, atBlockIndex, setAtBlockIndex, setIsCurrentTemplates, isCurrentTab, isCurrentTemplates }) => {

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState(null);
    const [urlError, setUrlError] = useState("");

    const fileInputRef = useRef(null);

    const dispatch = useDispatch();

    const handleUrlChange = (e) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);

        // Check if the URL belongs to the same domain
        const currentDomain = window.location.origin;
        try {
            const newUrl = new URL(inputUrl);
            if (newUrl.origin !== currentDomain) {
                setUrlError("URL must be in the same domain.");
            } else {
                setUrlError(""); // No error
            }
        } catch (error) {
            setUrlError("Invalid URL.");
        }
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const resetCurrentState = () => {
        setTitle("");
        setUrl("");
        setImage(null);
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
                        <label htmlFor="url" className="form-label">
                            <span>Add URL </span>
                            <span className="text-danger small">*</span>
                        </label>
                        <input
                            type="url"
                            className="form-control"
                            id="url"
                            value={url}
                            onChange={handleUrlChange}
                            required
                        />
                        {urlError && <div className="text-danger">{urlError}</div>}
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