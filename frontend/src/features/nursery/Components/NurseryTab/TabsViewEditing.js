import React, { useState, useMemo } from 'react';
import TemplateCompleteSection from '../Templates/TemplateCompleteSection';
import TemplateTwoSection from '../Templates/TemplateTwoSection';
import TemplateFourSection from '../Templates/TemplateFourSection';
import TemplateTwoSectionAndRightVertical from '../Templates/TemplateTwoSectionAndRightVertical';
import TemplateTwoSectionAndRightFour from '../Templates/TemplateTwoSectionAndRightFour';
import TemplateTwoSectionAndLeftVertical from '../Templates/TemplateTwoSectionAndLeftVertical';
import TemplateTwoSectionAndLeftFour from '../Templates/TemplateTwoSectionAndLeftFour';
import { completeSection, fourSection, twoSection, twoSectionAndLeftFour, twoSectionAndLeftVertical, twoSectionAndRightFour, twoSectionAndRightVertical } from '../utils/templatesAPI';
import { useDispatch, useSelector } from 'react-redux';
import { AddNurseryStoreTemplatesAsync, changeTemplateRenderPositionAsync, deleteNurseryStoreTemplatesAsync, deleteTabSectionAsync, deleteTemplateFromSectionAsync, nurseryStoreImagesUpload, nurseryStoreTabDeleteAsync, nurseryStoreTabEditAsync, nurseryStoreTemplatesChangeRenderPositionByTabsIdAsync } from '../../nurserySlice';
import ChooseTemplate from '../../../common/ChooseTemplate';
import { message, Tooltip } from 'antd';
import AddBlocksModel from '../Blocks/AddBlocksModel';
import EditBlocksModel from '../Blocks/EditBlocksModel';

const TabsViewEditing = ({ content, status }) => {

    const nurseryStoreBlocks = useSelector(state => state.nursery.nurseryStoreBlocks);
    const isCurrentTab = useSelector(state => state.nursery.isCurrentTab);

    const dispatch = useDispatch();

    const [isChooseModeOpen, setIsChooseModeOpen] = useState(false);
    const [atIndex, setAtIndex] = useState(null);
    const [atBlockIndex, setAtBlockIndex] = useState(null);
    const [isCurrentTemplates, setIsCurrentTemplates] = useState(null);
    const [isCurrentBlock, setIsCurrentBlock] = useState(null);

    const [isModelOpen, setIsModelOpen] = useState(false);
    const [isModelOpenEdit, setIsModelOpenEdit] = useState(false);

    //^ Ant Design Tooltip 
    const [arrow, setArrow] = useState('Show');
    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    const handelSelectedTemplate = async (templateName) => {
        setIsChooseModeOpen(false);

        if (isCurrentTab && isCurrentTab !== "info") {

            const initTemplateData = {
                nurseryStoreTabs: isCurrentTab.toString().toLocaleLowerCase(),
                index: atIndex ?? 0,
                templateName
            }

            dispatch(AddNurseryStoreTemplatesAsync(initTemplateData));

        } else message.error("Error: Current Tabs not found.");
    }

    const handleImageUploadNurseryStore = async (e, renderId, imageId) => {
        e.preventDefault();

        // const contentIndex = nurseryStore.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        // const tabId = nurseryStore[contentIndex]._id;

        // const data = new FormData();
        // data.append(e.target.name, e.target.files[0]);
        // data.append("nurserId", nursery._id);
        // data.append("user", nursery.user);
        // data.append("rendersId", renderId);
        // data.append("tabId", tabId);


        // dispatch(nurseryStoreImagesUpload({ imageId, data }))
    }


    const handelDeleteRendersUpload = async (index) => {
        // const contentIndex = nurseryStore.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        // const newContents = { ...nurseryStore[contentIndex] };

        // const newRenders = [...newContents.renders];


        // newRenders.splice(index, 1);

        // newContents.renders = newRenders;

        // const data = newContents;

        // data.user = nursery.user;
        // data.nursery = nursery._id;

        // dispatch(deleteTemplateFromSectionAsync({ _id: data._id, data }))
    }

    const handelChangeRenderPosition = async (prev, next) => {

        //! if we move two or more steps up and down, to change the positions 
        if (!prev || !next || Math.abs(prev.index - next.index) != 1) {
            message.error("Invalid Change Render Position");
            return;
        }

        const data = {
            preData: {
                _id: prev._id,
                index: prev.index
            },
            nextData: {
                _id: next._id,
                index: next.index
            }
        }


        //! if current section is not info or null or undefined
        if (!isCurrentTab || isCurrentTab !== 'info') {
            dispatch(nurseryStoreTemplatesChangeRenderPositionByTabsIdAsync({ id: isCurrentTab, data }));
        } else {
            alert("Error: Current Tabs not found.")
        }
    }


    const renderContents = content && content.map((elem, index) => {
        const blocksData = nurseryStoreBlocks && nurseryStoreBlocks.filter(blockData => (blockData.nurseryStoreTabs.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase()) && blockData.nurseryStoreTemplates.toLocaleLowerCase() === elem._id.toLocaleLowerCase());

        const blocks = []; //? creating empty blocks of arrays....

        //* Sort blocks based on their index
        blocksData.forEach(e => {
            blocks[e.index] = e;
        });

        return (
            <div key={elem._id}>
                <div className='row flex-column-reverse flex-md-row'>
                    {elem.templateName === "completeSection" && <TemplateCompleteSection content={blocks} index={elem.index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} mergedArrow={mergedArrow} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={elem._id} setIsModelOpenEdit={setIsModelOpenEdit} setIsCurrentBlock={setIsCurrentBlock} />}
                    {elem.templateName === "twoSection" && <TemplateTwoSection content={blocks} index={elem.index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} mergedArrow={mergedArrow} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={elem._id} setIsModelOpenEdit={setIsModelOpenEdit} setIsCurrentBlock={setIsCurrentBlock} />}
                    {elem.templateName === "fourSection" && <TemplateFourSection content={blocks} index={elem.index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} mergedArrow={mergedArrow} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={elem._id} setIsModelOpenEdit={setIsModelOpenEdit} setIsCurrentBlock={setIsCurrentBlock} />}
                    {elem.templateName === "twoSectionAndRightVertical" && <TemplateTwoSectionAndRightVertical content={blocks} index={elem.index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} mergedArrow={mergedArrow} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={elem._id} setIsModelOpenEdit={setIsModelOpenEdit} setIsCurrentBlock={setIsCurrentBlock} />}
                    {elem.templateName === "twoSectionAndRightFour" && <TemplateTwoSectionAndRightFour content={blocks} index={elem.index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} mergedArrow={mergedArrow} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={elem._id} setIsModelOpenEdit={setIsModelOpenEdit} setIsCurrentBlock={setIsCurrentBlock} />}
                    {elem.templateName === "twoSectionAndLeftVertical" && <TemplateTwoSectionAndLeftVertical content={blocks} index={elem.index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} mergedArrow={mergedArrow} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={elem._id} setIsModelOpenEdit={setIsModelOpenEdit} setIsCurrentBlock={setIsCurrentBlock} />}
                    {elem.templateName === "twoSectionAndLeftFour" && <TemplateTwoSectionAndLeftFour content={blocks} index={elem.index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} mergedArrow={mergedArrow} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={elem._id} setIsModelOpenEdit={setIsModelOpenEdit} setIsCurrentBlock={setIsCurrentBlock} />}
                    <div className="col-12 col-md-1 justify-content-end justify-content-md-center d-flex flex-md-column my-3 my-md-0" style={{ transform: 'translate: (-100%, -50%)' }}> 
                        <div className='d-md-none'>
                            <Tooltip className='btn btn-sm btn-danger' placement="bottomRight" title={'Delete Template'} arrow={mergedArrow}  onClick={() => dispatch(deleteNurseryStoreTemplatesAsync(elem._id))}>
                                <span className="fas fa-trash text-light p-2" onClick={() => handelDeleteRendersUpload(index)}></span> DELETE TEMPLATE
                            </Tooltip>
                        </div>
                        <div className='d-none d-md-block'>
                            <Tooltip placement="left" title={'Delete Template'} arrow={mergedArrow} onClick={() => dispatch(deleteNurseryStoreTemplatesAsync(elem._id))}>
                                <span className="fas fa-trash text-danger p-2 cursor-pointer" onClick={() => handelDeleteRendersUpload(index)}></span>
                            </Tooltip>
                        </div>
                    </div>

                </div>

                {
                    content.length - 1 === index ?

                        <div className='d-flex justify-content-between align-items-center' >
                            <div className="border w-100"></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => { setAtIndex(1 + Number.parseInt(elem.index)); setIsChooseModeOpen(true) }}><i className="fas fa-plus-circle"></i></div>
                            <div className="border w-100"></div>
                        </div>
                        :

                        //* ⬆️ ➕ ⬇️ Render after every render elements........
                        <div className='d-flex justify-content-between align-items-center' >
                            <div className="border w-100"></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => handelChangeRenderPosition({ _id: content[index + 1]._id, index: index + 1 }, { _id: content[index]._id, index })}><i className="far fa-arrow-alt-circle-up"></i></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => { setAtIndex(1 + Number.parseInt(elem.index)); setIsChooseModeOpen(true) }}><i className="fas fa-plus-circle"></i></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => handelChangeRenderPosition({ _id: content[index]._id, index }, { _id: content[index + 1]._id, index: index + 1 })}><i className="far fa-arrow-alt-circle-down"></i></div>
                            <div className="border w-100"></div>
                        </div>
                }
            </div>
        )
    })

    return (
        <>
            <div key={isCurrentTab} className="p-0 p-md-3">
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                    <div className="option me-1 me-md-2 my-1">
                        <button className="btn btn-sm btn-info d-flex align-items-center"><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">preview</span> Preview</button>
                    </div>

                    {
                        status.toLocaleLowerCase() === 'draft' ?
                            <div className="option me-1 me-md-2 my-1">
                                <button className="btn btn-sm btn-success d-flex align-items-center" onClick={() => dispatch(nurseryStoreTabEditAsync({id: isCurrentTab, data: {status: "publish"}}))} ><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">public</span> Publish</button>
                            </div>
                            :

                            status.toLocaleLowerCase() === 'publish' && 
                            <div className="option me-1 me-md-2 my-1">
                                <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={() => dispatch(nurseryStoreTabEditAsync({id: isCurrentTab, data: {status: "draft"}}))} ><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">edit</span> Edit</button>
                            </div>
                    }

                    <div className="option my-1">
                        <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => dispatch(nurseryStoreTabDeleteAsync(isCurrentTab))}><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">delete</span> Delete</button>
                    </div>
                </div>
                <div className="border mt-1 mb-3"></div>


                {
                    content && content.length === 0 ?
                        <div className="row p-5">
                            <button className='btn btn-lg btn-light border-black d-flex align-items-center justify-content-center p-4 p-md-5' onClick={() => { setIsChooseModeOpen(true); setAtIndex(0) }}><span style={{ fontSize: "28px" }} className="material-symbols-outlined me-1">add</span><span>Add Contents</span></button>
                        </div>
                        :
                        <div className='template-in-use-container'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className="border w-100"></div>
                                <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => { setAtIndex(0); setIsChooseModeOpen(true) }}><i className="fas fa-plus-circle"></i></div>
                                <div className="border w-100"></div>
                            </div>
                            {renderContents}
                        </div>
                }
            </div>
            {
                isChooseModeOpen && <ChooseTemplate setIsChooseModeOpen={setIsChooseModeOpen} handelSelectedTemplate={handelSelectedTemplate} />
            }

            {
                isModelOpen &&
                <AddBlocksModel isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen} setAtBlockIndex={setAtBlockIndex} atBlockIndex={atBlockIndex} setIsCurrentTemplates={setIsCurrentTemplates} isCurrentTemplates={isCurrentTemplates} isCurrentTab={isCurrentTab} />
            }

            
            {
                isModelOpenEdit && 
                <EditBlocksModel isModelOpenEdit={isModelOpenEdit} setIsModelOpenEdit={setIsModelOpenEdit}  setIsCurrentBlock={setIsCurrentBlock} isCurrentBlock={isCurrentBlock} setIsCurrentTemplates={setIsCurrentTemplates}  isCurrentTemplates={isCurrentTemplates} isCurrentTab={isCurrentTab} />
            }
        </>
    );
}

export default TabsViewEditing