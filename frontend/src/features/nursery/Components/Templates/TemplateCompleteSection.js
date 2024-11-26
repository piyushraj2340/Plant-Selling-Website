import React from 'react';
import { Tooltip } from 'antd';
import { useDispatch } from 'react-redux';
import { nurseryStoreBlockDeleteAsync } from '../../nurserySlice';

const TemplateCompleteSection = ({ content, mergedArrow, setIsModelOpen, setAtBlockIndex, setIsCurrentTemplates, isCurrentTemplates, setIsModelOpenEdit, setIsCurrentBlock }) => {

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
                content.length && content[0].image.url !== "" ?
                    <div className='p-0 template template-images rounded position-relative'>
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
                    </div>

                    :


                    <div className="template template-header rounded d-flex justify-content-center align-items-center hover-images" onClick={() => { setIsModelOpen(true); setAtBlockIndex(0); setIsCurrentTemplates(isCurrentTemplates) }}>
                        <div className="template template-header-complete rounded bg-secondary w-100">
                            <p className='text-center user-select-none'><i className='fas fa-images'></i> Add Content</p>
                        </div>
                    </div>

            }
        </div>




    )
}

export default TemplateCompleteSection