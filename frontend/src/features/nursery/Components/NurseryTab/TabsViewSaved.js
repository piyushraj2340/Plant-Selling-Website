import React from 'react';
import TemplateHeader from '../Templates/TemplateCompleteSection';
import TemplateTwoSection from '../Templates/TemplateTwoSection';
import TemplateFourSection from '../Templates/TemplateFourSection';
import TemplateTwoSectionAndRightVertical from '../Templates/TemplateTwoSectionAndRightVertical';
import TemplateTwoSectionAndRightFour from '../Templates/TemplateTwoSectionAndRightFour';
import TemplateTwoSectionAndLeftVertical from '../Templates/TemplateTwoSectionAndLeftVertical';
import TemplateTwoSectionAndLeftFour from '../Templates/TemplateTwoSectionAndLeftFour';

// TODO: CREATE A VIEW FOR PUBLIC STORE RENDERING
const TabsViewSaved = ({ content }) => {

    const renderContents = content.renders.map((render) => {

        return (
            <div key={render.templateId}>
                {render.templateId === "completeSection" && <TemplateHeader content={render} />}
                {render.templateId === "twoSection" && <TemplateTwoSection content={render} />}
                {render.templateId === "fourSection" && <TemplateFourSection content={render} />}
                {render.templateId === "twoSectionAndRightVertical" && <TemplateTwoSectionAndRightVertical content={render} />}
                {render.templateId === "twoSectionAndRightFour" && <TemplateTwoSectionAndRightFour content={render} />}
                {render.templateId === "twoSectionAndLeftVertical" && <TemplateTwoSectionAndLeftVertical content={render} />}
                {render.templateId === "twoSectionAndLeftFour" && <TemplateTwoSectionAndLeftFour content={render} />}
                {/* {
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
                } */}
            </div>
        )
    })

    return (
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
                    <button className="btn btn-sm btn-danger d-flex align-items-center"><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">delete</span> Delete</button>
                </div>
            </div>
            <div className="border mt-1 mb-3"></div>


            {/* {
                content.renders.length === 0 ?
                    <div className="row p-5">
                        <button className='btn btn-lg btn-light border-black d-flex align-items-center justify-content-center p-4 p-md-5' onClick={() => { setIsChooseModeOpen(true) }}><span style={{ fontSize: "28px" }} className="material-symbols-outlined me-1">add</span><span>Add Contents</span></button>
                    </div>
                    : */}
                    <div className='template-in-use-container'>
                        {/* <div className='d-flex justify-content-between align-items-center'>
                            <div className="border w-100"></div>
                            <div className="rounded p-2 cursor-pointer" style={{ fontSize: "20px" }} onClick={() => { setAtIndex(0); setIsChooseModeOpen(true) }}><i className="fas fa-plus-circle"></i></div>
                            <div className="border w-100"></div>
                        </div> */}
                        {renderContents}
                    </div>
            {/* } */}
        </div>
    );
}

export default TabsViewSaved