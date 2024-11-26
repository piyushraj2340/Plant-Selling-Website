import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, message } from 'antd';
import { nurseryStoreBlockUpdateAsync } from '../../nurserySlice';
// import { nurseryStoreBlockAddAsync } from '../store/nurseryStoreSlice'; // Assuming the action

const EditBlocksModel = ({ isModelOpenEdit, setIsModelOpenEdit,  setIsCurrentBlock, isCurrentBlock, setIsCurrentTemplates, isCurrentTemplates, isCurrentTab}) => {
    const blockStore = useSelector(state => state.nursery.nurseryStoreBlocks);
    const block = blockStore.find(e => e._id === isCurrentBlock);

    if(!block) {
        message.error("Block not found");
        setIsModelOpenEdit(false);
    }
    

    const [title, setTitle] = useState(block? block.title: '');
    const [url, setUrl] = useState(block? block.url: '');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(block? block.image.url: '');
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

    // Handle image upload and preview
    const handleImageUpload = (e) => {
        setImage(e.target.files[0])
    };

    // Handle image removal
    const removeImage = () => {
        setImageUrl(null); // Clear the image
        if(fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
    };

    // Reset the form and close modal
    const resetCurrentState = () => {
        setTitle("");
        setUrl("");
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
        setUrlError("");
        setIsCurrentTemplates(null);
        setIsCurrentBlock(null);
        setIsModelOpenEdit(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!isCurrentTab || !isCurrentTemplates) {
            message.error("Invalid Model Selected...");
            resetCurrentState();
            return;
        }
        
        if (!urlError) {
            //? Submit form logic here
            const data = new FormData();
            if(image && !imageUrl) {
                data.append("image", image);
            }
            data.append("nurseryStoreTabs", isCurrentTab);
            data.append("nurseryStoreTemplates", isCurrentTemplates);
            data.append("title", title);
            data.append("url", url);
            data.append("old_img_public_id", block.image.public_id);

            dispatch(nurseryStoreBlockUpdateAsync({id: isCurrentBlock, data}));
            resetCurrentState();
        }
    };

    return (
        <Modal
            title="Customize Your Store Page"
            centered
            open={isModelOpenEdit}
            onOk={handleSubmit}
            onCancel={() => setIsModelOpenEdit(false)}
            footer={[
                <Button key="back" onClick={resetCurrentState}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>,
            ]}
        >
            <div className="container mt-3">
                <h3>Edit Your Content</h3>
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

                    {/* Image upload or preview */}
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                            <span>Upload Image </span>
                            <span className="text-danger small">*</span>
                        </label>

                        {imageUrl && !image ? (
                            <div className="position-relative">
                                <img
                                    src={imageUrl}
                                    alt="Uploaded Preview"
                                    className="img-thumbnail"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                                <button
                                    type="button"
                                    className="btn-close position-absolute top-0 end-0"
                                    aria-label="Remove"
                                    onClick={removeImage}
                                    style={{ backgroundColor: 'red', color: 'white' }}
                                ></button>
                            </div>
                        ) : (
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="form-control"
                                id="image"
                                accept="image/png, image/jpeg"
                                onChange={handleImageUpload}
                                required
                            />
                        )}
                    </div>

                </form>
            </div>
        </Modal>
    );
};

export default EditBlocksModel;
