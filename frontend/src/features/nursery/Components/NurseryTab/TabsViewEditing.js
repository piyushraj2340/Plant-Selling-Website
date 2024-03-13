import React, { useState } from 'react';
import TemplateHeader from '../Templates/TemplateCompleteSection';
import TemplateTwoSection from '../Templates/TemplateTwoSection';
import TemplateFourSection from '../Templates/TemplateFourSection';
import TemplateTwoSectionAndRightVertical from '../Templates/TemplateTwoSectionAndRightVertical';
import TemplateTwoSectionAndRightFour from '../Templates/TemplateTwoSectionAndRightFour';
import TemplateTwoSectionAndLeftVertical from '../Templates/TemplateTwoSectionAndLeftVertical';
import TemplateTwoSectionAndLeftFour from '../Templates/TemplateTwoSectionAndLeftFour';
import { completeSection, fourSection, twoSection, twoSectionAndLeftFour, twoSectionAndLeftVertical, twoSectionAndRightFour, twoSectionAndRightVertical } from '../utils/templatesAPI';
import { useDispatch, useSelector } from 'react-redux';
import { addTemplateToStoreAsync, changeTemplateRenderPositionAsync, deleteTabSectionAsync, deleteTemplateFromSectionAsync, nurseryStoreImagesUpload } from '../../nurserySlice';
import ChooseTemplate from '../../../common/ChooseTemplate';

const TabsViewEditing = ({ content }) => {

    const nursery = useSelector(state => state.nursery.nursery);
    const nurseryStore = useSelector(state => state.nursery.nurseryStore);
    const isCurrentTab = useSelector(state => state.nursery.isCurrentTab);

    const dispatch = useDispatch();

    const [isChooseModeOpen, setIsChooseModeOpen] = useState(false);
    const [atIndex, setAtIndex] = useState(null);

    const handelSelectedTemplate = async (templateId) => {
        setIsChooseModeOpen(false);

        const contentIndex = nurseryStore.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        if (contentIndex !== -1) {
            const templateMap = {
                completeSection,
                twoSection,
                fourSection,
                twoSectionAndRightVertical,
                twoSectionAndRightFour,
                twoSectionAndLeftVertical,
                twoSectionAndLeftFour
            };

            const templateObj = templateMap[templateId];

            const data = { ...nurseryStore[contentIndex] };
            const renders = [...data.renders];

            if (atIndex === null) {
                templateObj.templateId = templateId;
                renders.push(templateObj);
            } else {
                templateObj.templateId = templateId;
                renders.splice(atIndex, 0, templateObj);
            }

            data.renders = renders;

            dispatch(addTemplateToStoreAsync({ _id: data._id, data }));

        } else alert("Error: Current Tabs not found.");
    }

    const handleImageUploadNurseryStore = async (e, renderId, imageId) => {
        e.preventDefault();

        const contentIndex = nurseryStore.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        const tabId = nurseryStore[contentIndex]._id;

        const data = new FormData();
        data.append(e.target.name, e.target.files[0]);
        data.append("nurserId", nursery._id);
        data.append("user", nursery.user);
        data.append("rendersId", renderId);
        data.append("tabId", tabId);


        dispatch(nurseryStoreImagesUpload({ imageId, data }))
    }


    const handelDeleteRendersUpload = async (index) => {
        const contentIndex = nurseryStore.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        const newContents = { ...nurseryStore[contentIndex] };

        const newRenders = [...newContents.renders];


        newRenders.splice(index, 1);

        newContents.renders = newRenders;

        const data = newContents;

        data.user = nursery.user;
        data.nursery = nursery._id;

        dispatch(deleteTemplateFromSectionAsync({ _id: data._id, data }))
    }

    const handelChangeRenderPosition = async (prev, next) => {
        const contentIndex = nurseryStore.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        if (contentIndex !== -1) {
            const newContents = { ...nurseryStore[contentIndex] };

            const newRenders = [...newContents.renders];

            // swap 
            let temp = newRenders[prev];
            newRenders[prev] = newRenders[next];
            newRenders[next] = temp;

            newContents.renders = newRenders;

            const data = newContents;

            data.user = nursery.user;
            data.nursery = nursery._id;

            dispatch(changeTemplateRenderPositionAsync({ _id: data._id, data }))


        } else {
            alert("Error: Current Tabs not found.")
        }
    }



    const renderContents = content.renders.map((render, index) => {

        return (
            <div key={render._id}>
                {render.templateId === "completeSection" && <TemplateHeader content={render} index={index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />}
                {render.templateId === "twoSection" && <TemplateTwoSection content={render} index={index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />}
                {render.templateId === "fourSection" && <TemplateFourSection content={render} index={index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />}
                {render.templateId === "twoSectionAndRightVertical" && <TemplateTwoSectionAndRightVertical content={render} index={index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />}
                {render.templateId === "twoSectionAndRightFour" && <TemplateTwoSectionAndRightFour content={render} index={index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />}
                {render.templateId === "twoSectionAndLeftVertical" && <TemplateTwoSectionAndLeftVertical content={render} index={index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />}
                {render.templateId === "twoSectionAndLeftFour" && <TemplateTwoSectionAndLeftFour content={render} index={index} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />}
                {
                    content.renders.length - 1 === index ?

                        <div className='d-flex justify-content-between align-items-center' >
                            <div className="border w-100"></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => { setAtIndex(1 + Number.parseInt(index)); setIsChooseModeOpen(true) }}><i className="fas fa-plus-circle"></i></div>
                            <div className="border w-100"></div>
                        </div>
                        :

                        <div className='d-flex justify-content-between align-items-center' >
                            <div className="border w-100"></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => handelChangeRenderPosition(index + 1, index)}><i className="far fa-arrow-alt-circle-up"></i></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => { setAtIndex(1 + Number.parseInt(index)); setIsChooseModeOpen(true) }}><i className="fas fa-plus-circle"></i></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => handelChangeRenderPosition(index, index + 1)}><i className="far fa-arrow-alt-circle-down"></i></div>
                            <div className="border w-100"></div>
                        </div>
                }
            </div>
        )
    })

    return (
        <>
            <div key={content._id} className="p-0 p-md-3">
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                    <div className="option me-1 me-md-2 my-1">
                        <button className="btn btn-sm btn-info d-flex align-items-center"><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">save</span> Save</button>
                    </div>
                    <div className="option me-1 me-md-2 my-1">
                        <button className="btn btn-sm btn-primary d-flex align-items-center"><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">draft</span> Draft</button>
                    </div>
                    <div className="option me-1 me-md-2 my-1">
                        <button className="btn btn-sm btn-success d-flex align-items-center"><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">public</span> Publish</button>
                    </div>
                    <div className="option my-1">
                        <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => dispatch(deleteTabSectionAsync(content._id))}><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">delete</span> Delete</button>
                    </div>
                </div>
                <div className="border mt-1 mb-3"></div>


                {
                    content.renders.length === 0 ?
                        <div className="row p-5">
                            <button className='btn btn-lg btn-light border-black d-flex align-items-center justify-content-center p-4 p-md-5' onClick={() => { setIsChooseModeOpen(true) }}><span style={{ fontSize: "28px" }} className="material-symbols-outlined me-1">add</span><span>Add Contents</span></button>
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
        </>
    );
}

export default TabsViewEditing