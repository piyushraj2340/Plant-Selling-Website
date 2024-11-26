import { Tooltip } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { nurseryStoreBlockDeleteAsync } from '../../nurserySlice';

const TemplateTwoSectionAndRightFour = ({ content, index, handelDeleteRendersUpload, handleImageUploadNurseryStore, mergedArrow, setIsModelOpen, setAtBlockIndex, isCurrentTemplates, setIsCurrentTemplates, setIsModelOpenEdit, setIsCurrentBlock }) => {

    const dispatch = useDispatch();

    const handelOpenEditModel = (id) => {
        setIsModelOpenEdit(true);
        setIsCurrentTemplates(isCurrentTemplates);
        setIsCurrentBlock(id);
    }

    const handelDeleteBlock = (id) => {
        dispatch(nurseryStoreBlockDeleteAsync(id));
    }


    return (
        <div className='col-12 col-md-11 px-2 px-md-0'>

            {
                content.length > 0 ?

                    <div className="p-0 template template-half-right-two template-images rounded" >
                        <div className="template-half-right-two-first rounded border border-black position-relative w-100">
                            {
                                content[0] && content[0].image.url !== "" ?
                                    <div className="hover-images w-100 h-100">
                                        <a href={content[0].url} target="_blank" rel="noopener noreferrer">
                                            <img src={content[0].image.url} className='w-100 img-fluid rounded' alt={content[0].title} />
                                        </a>
                                        <div className="position-absolute images-options">
                                            <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => {handelOpenEditModel(content[0]._id)}}>
                                                <span className="fas fa-pen text-primary p-2"></span>
                                            </Tooltip>
                                            <Tooltip placement="bottomRight" title={'Delete Image'} arrow={mergedArrow} onClick={() => handelDeleteBlock(content[0]._id)}>
                                                <span className="fas fa-trash text-danger p-2"></span>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    :
                                    <div className="template template-header rounded d-flex justify-content-center align-items-center h-100 w-100 hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(0); setIsCurrentTemplates(isCurrentTemplates) }}>
                                        <div className="template-header-complete rounded ">
                                            <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className="template-half-right-two-second rounded d-flex flex-column align-items-start h-100 rounded w-100">
                            <div className="first w-100 h-50 d-flex rounded mb-1">
                                <div className='rounded border border-black position-relative me-1 w-100'>
                                    {
                                        content[1] && content[1].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[1].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[1].image.url} className='w-100 img-fluid rounded' alt={content[1].title} />
                                                </a>
                                                <div className="position-absolute images-options">
                                                    <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => {handelOpenEditModel(content[1]._id)}}>
                                                        <span className="fas fa-pen text-primary p-2"></span>
                                                    </Tooltip>
                                                    <Tooltip placement="bottomRight" title={'Delete Image'} arrow={mergedArrow} onClick={() => handelDeleteBlock(content[1]._id)}>
                                                        <span className="fas fa-trash text-danger p-2"></span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            :

                                            <div className="template template-header rounded d-flex justify-content-center align-items-center h-100 w-100 hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(1); setIsCurrentTemplates(isCurrentTemplates) }}>
                                                <div className="template-header-complete rounded ">
                                                    <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <div className='rounded border border-black position-relative w-100'>
                                    {
                                        content[2] && content[2].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[2].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[2].image.url} className='w-100 img-fluid rounded' alt={content[2].title} />
                                                </a>
                                                <div className="position-absolute images-options">
                                                    <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => {handelOpenEditModel(content[2]._id)}}>
                                                        <span className="fas fa-pen text-primary p-2"></span>
                                                    </Tooltip>
                                                    <Tooltip placement="bottomRight" title={'Delete Image'} arrow={mergedArrow} onClick={() => handelDeleteBlock(content[2]._id)}>
                                                        <span className="fas fa-trash text-danger p-2"></span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            :

                                            <div className="template template-header rounded d-flex justify-content-center align-items-center h-100 w-100 hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(2); setIsCurrentTemplates(isCurrentTemplates) }}>
                                                <div className="template-header-complete rounded ">
                                                    <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                                </div>
                                            </div>
                                    }
                                </div>

                            </div>
                            <div className="second w-100 h-50 d-flex rounded">
                                <div className='rounded border border-black position-relative me-1 w-100'>
                                    {
                                        content[3] && content[3].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[3].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[3].image.url} className='w-100 img-fluid rounded' alt={content[3].title} />
                                                </a>
                                                <div className="position-absolute images-options">
                                                    <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => {handelOpenEditModel(content[3]._id)}}>
                                                        <span className="fas fa-pen text-primary p-2"></span>
                                                    </Tooltip>
                                                    <Tooltip placement="bottomRight" title={'Delete Image'} arrow={mergedArrow} onClick={() => handelDeleteBlock(content[3]._id)}>
                                                        <span className="fas fa-trash text-danger p-2"></span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            :

                                            <div className="template template-header rounded d-flex justify-content-center align-items-center h-100 w-100 hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(3); setIsCurrentTemplates(isCurrentTemplates) }}>
                                                <div className="template-header-complete rounded ">
                                                    <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <div className='rounded border border-black position-relative w-100'>
                                    {
                                        content[4] && content[4].image.url !== "" ?
                                            <div className="hover-images w-100 h-100">
                                                <a href={content[4].url} target="_blank" rel="noopener noreferrer">
                                                    <img src={content[4].image.url} className='w-100 img-fluid rounded' alt={content[4].title} />
                                                </a>
                                                <div className="position-absolute images-options">
                                                    <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => {handelOpenEditModel(content[4]._id)}}>
                                                        <span className="fas fa-pen text-primary p-2"></span>
                                                    </Tooltip>
                                                    <Tooltip placement="bottomRight" title={'Delete Image'} arrow={mergedArrow} onClick={() => handelDeleteBlock(content[4]._id)}>
                                                        <span className="fas fa-trash text-danger p-2"></span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            :

                                            <div className="template template-header rounded d-flex justify-content-center align-items-center h-100 w-100 hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(4); setIsCurrentTemplates(isCurrentTemplates) }}>
                                                <div className="template-header-complete rounded ">
                                                    <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>

                    :

                    <div className="template template-half-right-two rounded hover-images position-relative">
                        <div className="template-half-right-two-first rounded">
                            <div className="template w-100 template-header rounded d-flex justify-content-center align-items-center hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(0); setIsCurrentTemplates(isCurrentTemplates) }}>
                                <div className="template-header-complete rounded ">
                                    <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                </div>
                            </div>                        </div>
                        <div className="template-half-right-two-second rounded d-flex flex-column w-100 h-100 rounded">
                            <div className="first mb-1 h-100 w-100 d-flex justify-content-center align-items-center rounded">
                                <div className="template-hover h-100 w-100 me-1 template-header rounded d-flex justify-content-center align-items-center hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(1); setIsCurrentTemplates(isCurrentTemplates) }}>
                                    <div className="template-header-complete rounded ">
                                        <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                    </div>
                                </div>
                                <div className="template-hover h-100 w-100 me-1 template-header rounded d-flex justify-content-center align-items-center hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(2); setIsCurrentTemplates(isCurrentTemplates) }}>
                                    <div className="template-header-complete rounded ">
                                        <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                    </div>
                                </div>
                            </div>
                            <div className="second h-100 w-100 d-flex justify-content-center align-items-center rounded">
                                <div className="template-hover h-100 w-100 me-1 template-header rounded d-flex justify-content-center align-items-center hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(3); setIsCurrentTemplates(isCurrentTemplates) }}>
                                    <div className="template-header-complete rounded ">
                                        <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                    </div>
                                </div>
                                <div className="template-hover h-100 w-100 me-1 template-header rounded d-flex justify-content-center align-items-center hover-images bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(4); setIsCurrentTemplates(isCurrentTemplates) }}>
                                    <div className="template-header-complete rounded ">
                                        <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }

        </div>
    )
}

export default TemplateTwoSectionAndRightFour