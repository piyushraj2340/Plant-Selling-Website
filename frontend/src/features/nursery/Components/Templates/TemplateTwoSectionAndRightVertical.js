import { Tooltip } from 'antd'
import React from 'react'
import { nurseryStoreBlockDeleteAsync } from '../../nurserySlice';
import { useDispatch } from 'react-redux';

const TemplateTwoSectionAndRightVertical = ({ content, index, handelDeleteRendersUpload, handleImageUploadNurseryStore, mergedArrow, setIsModelOpen, setAtBlockIndex, isCurrentTemplates, setIsCurrentTemplates, setIsModelOpenEdit, setIsCurrentBlock }) => {

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
                    <div className="p-0 template template-half-right-two template-images vertical rounded" >
                        <div className="template-half-right-two-first rounded border border-black position-relative">

                            {
                                content[0] && content[0].image.url !== "" ?
                                    <div className="hover-images w-100 h-100">
                                        <a href={content[0].url} target="_blank" rel="noopener noreferrer">
                                            <img src={content[0].image.url} className='w-100 img-fluid rounded' alt={content[0].title} />
                                        </a>
                                        <div className="position-absolute images-options">
                                            <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => { handelOpenEditModel(content[0]._id) }}>
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
                        <div className="template-half-right-two-second rounded d-flex flex-column w-100 h-100 rounded">
                            <div className="first bg-secondary w-100 h-50 d-flex justify-content-center align-items-center mb-1 rounded border border-black position-relative">
                                {
                                    content[1] && content[1].image.url !== "" ?
                                        <div className="hover-images w-100 h-100">
                                            <a href={content[1].url} target="_blank" rel="noopener noreferrer">
                                                <img src={content[1].image.url} className='w-100 img-fluid rounded' alt={content[1].title} />
                                            </a>
                                            <div className="position-absolute images-options">
                                                <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => { handelOpenEditModel(content[1]._id) }}>
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
                            <div className="second bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded border border-black position-relative">
                                {
                                    content[2] && content[2].image.url !== "" ?
                                        <div className="hover-images w-100 h-100">
                                            <a href={content[2].url} target="_blank" rel="noopener noreferrer">
                                                <img src={content[2].image.url} className='w-100 img-fluid rounded' alt={content[2].title} />
                                            </a>
                                            <div className="position-absolute images-options">
                                                <Tooltip placement="bottomRight" title={'Re-Upload Image'} arrow={mergedArrow} onClick={() => { handelOpenEditModel(content[2]._id) }}>
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

                    </div>

                    :

                    <div className="template template-half-right-two vertical rounded position-relative hover-images" >
                        <div className="template template-half-right-two-first rounded my-2 bg-secondary" onClick={() => { setIsModelOpen(true); setAtBlockIndex(0); setIsCurrentTemplates(isCurrentTemplates) }}>
                            <div className="template-header-complete rounded">
                                <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                            </div>
                        </div>
                        <div className="template-half-right-two-second rounded d-flex flex-column align-items-center py-2 w-100 h-100 rounded">
                            <div className="template-hover first mb-2 bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded" onClick={() => { setIsModelOpen(true); setAtBlockIndex(1); setIsCurrentTemplates(isCurrentTemplates) }}>
                                <div className="template-header-complete rounded">
                                    <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                </div>
                            </div>
                            <div className="template-hover second bg-secondary w-100 h-50 d-flex justify-content-center align-items-center rounded" onClick={() => { setIsModelOpen(true); setAtBlockIndex(2); setIsCurrentTemplates(isCurrentTemplates) }}>
                                <div className="template-header-complete rounded">
                                    <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                                </div>
                            </div>
                        </div>
                    </div>
            }


        </div>

    )
}

export default TemplateTwoSectionAndRightVertical