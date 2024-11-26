import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import TemplateCompleteSectionSaved from '../TemplatesSaved/TemplateCompleteSectionSaved';
import TemplateTwoSectionSaved from '../TemplatesSaved/TemplateTwoSectionSaved';
import TemplateFourSectionSaved from '../TemplatesSaved/TemplateFourSectionSaved';
import TemplateTwoSectionAndRightVerticalSaved from '../TemplatesSaved/TemplateTwoSectionAndRightVerticalSaved';
import TemplateTwoSectionAndRightFourSaved from '../TemplatesSaved/TemplateTwoSectionAndRightFourSaved';
import TemplateTwoSectionAndLeftVerticalSaved from '../TemplatesSaved/TemplateTwoSectionAndLeftVerticalSaved';
import TemplateTwoSectionAndLeftFourSaved from '../TemplatesSaved/TemplateTwoSectionAndLeftFourSaved';
import { nurseryStoreTabDeleteAsync, nurseryStoreTabEditAsync } from '../../nurserySlice';

// TODO: CREATE A VIEW FOR PUBLIC STORE RENDERING
const TabsViewSaved = ({ content, status }) => {

    const nurseryStoreBlocks = useSelector(state => state.nursery.nurseryStoreBlocks);
    const isCurrentTab = useSelector(state => state.nursery.isCurrentTab);

    const dispatch = useDispatch();

    const renderContents = content && content.map((elem, index) => {
        const blocksData = nurseryStoreBlocks && nurseryStoreBlocks.filter(blockData => (blockData.nurseryStoreTabs.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase()) && blockData.nurseryStoreTemplates.toLocaleLowerCase() === elem._id.toLocaleLowerCase());

        const blocks = []; //? creating empty blocks of arrays....

        //* Sort blocks based on their index
        blocksData.forEach(e => {
            blocks[e.index] = e;
        });

        return (
            <div key={elem._id}>
                <div className='row flex-column-reverse flex-md-row my-2'>
                    {elem.templateName === "completeSection" && <TemplateCompleteSectionSaved content={blocks} />}
                    {elem.templateName === "twoSection" && <TemplateTwoSectionSaved content={blocks} />}
                    {elem.templateName === "fourSection" && <TemplateFourSectionSaved content={blocks} />}
                    {elem.templateName === "twoSectionAndRightVertical" && <TemplateTwoSectionAndRightVerticalSaved content={blocks} />}
                    {elem.templateName === "twoSectionAndRightFour" && <TemplateTwoSectionAndRightFourSaved content={blocks} />}
                    {elem.templateName === "twoSectionAndLeftVertical" && <TemplateTwoSectionAndLeftVerticalSaved content={blocks} />}
                    {elem.templateName === "twoSectionAndLeftFour" && <TemplateTwoSectionAndLeftFourSaved content={blocks} />}
                </div>
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
                                <button className="btn btn-sm btn-success d-flex align-items-center" onClick={() => dispatch(nurseryStoreTabEditAsync({ id: isCurrentTab, data: { status: "publish" } }))} ><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">public</span> Publish</button>
                            </div>
                            :

                            status.toLocaleLowerCase() === 'publish' &&
                            <div className="option me-1 me-md-2 my-1">
                                <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={() => dispatch(nurseryStoreTabEditAsync({ id: isCurrentTab, data: { status: "draft" } }))} ><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">edit</span> Edit</button>
                            </div>
                    }

                    {/* <div className="option me-1 me-md-2 my-1">
                        <button className="btn btn-sm btn-secondary d-flex align-items-center" onClick={() => dispatch(nurseryStoreTabEditAsync({ id: isCurrentTab, data: { status: "draft" } }))} ><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">edit</span> Edit</button>
                    </div> */}

                    <div className="option my-1">
                        <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => dispatch(nurseryStoreTabDeleteAsync(isCurrentTab))}><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">delete</span> Delete</button>
                    </div>
                </div>
                <div className="border mt-1 mb-3"></div>

                <div className='template-in-use-container'>
                    {renderContents}
                </div>
            </div>
        </>
    );
}

export default TabsViewSaved