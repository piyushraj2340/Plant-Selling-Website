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
import { Link } from 'react-router-dom';

// TODO: CREATE A VIEW FOR PUBLIC STORE RENDERING
const TabsViewSaved = ({ content, nurseryStoreTabsSelected }) => {

    const { status, tabName } = nurseryStoreTabsSelected;

    const nurseryId = useSelector(state => state.nursery.nursery._id);


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
                <div className="d-flex justify-content-center mb-4 mt-2">
                    <div className="workflow-action-bar">
                        <div className={`workflow-status-badge ${status.toLowerCase()}`}>
                            <div className="workflow-status-dot"></div>
                            {status}
                        </div>
                        
                        <div style={{ width: '1px', height: '24px', backgroundColor: '#eaeaea', margin: '0 4px' }}></div>

                        <Link to={`/nursery/store/view/${nurseryId}?activeTab=${tabName.split(" ").join("").toLowerCase()}`} className="btn btn-sm btn-outline-info workflow-btn"><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">open_in_new</span> Public Store</Link>

                        {
                            status.toLocaleLowerCase() === 'draft' ?
                                <button className="btn btn-sm btn-success workflow-btn" onClick={() => dispatch(nurseryStoreTabEditAsync({ id: isCurrentTab, data: { status: "publish" } }))} ><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">public</span> Publish</button>
                                :
                                status.toLocaleLowerCase() === 'publish' &&
                                <button className="btn btn-sm btn-outline-primary workflow-btn" onClick={() => dispatch(nurseryStoreTabEditAsync({ id: isCurrentTab, data: { status: "draft" } }))} ><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">edit</span> Switch to Draft</button>
                        }

                        <button className="btn btn-sm btn-outline-danger workflow-btn" onClick={() => dispatch(nurseryStoreTabDeleteAsync(isCurrentTab))}><span style={{ fontSize: "16px" }} className="material-symbols-outlined me-1">delete</span> Delete Tab</button>
                    </div>
                </div>

                <div className='template-in-use-container'>
                    {renderContents}
                </div>
            </div>
        </>
    );
}

export default TabsViewSaved