import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TemplateCompleteSectionSaved from '../TemplatesSaved/TemplateCompleteSectionSaved';
import TemplateTwoSectionSaved from '../TemplatesSaved/TemplateTwoSectionSaved';
import TemplateFourSectionSaved from '../TemplatesSaved/TemplateFourSectionSaved';
import TemplateTwoSectionAndRightVerticalSaved from '../TemplatesSaved/TemplateTwoSectionAndRightVerticalSaved';
import TemplateTwoSectionAndRightFourSaved from '../TemplatesSaved/TemplateTwoSectionAndRightFourSaved';
import TemplateTwoSectionAndLeftVerticalSaved from '../TemplatesSaved/TemplateTwoSectionAndLeftVerticalSaved';
import TemplateTwoSectionAndLeftFourSaved from '../TemplatesSaved/TemplateTwoSectionAndLeftFourSaved';
import { nurseryPublicStoreGetPublishBlocks } from '../../nurseryPublicStoreSlice';

// TODO: CREATE A VIEW FOR PUBLIC STORE RENDERING
const NurseryTabsPublicView = ({ content, isCurrentTab, currentTabDynamic }) => {

    const nurseryStoreBlocks = useSelector(state => state.nurseryPublicStore.nurseryPublicStoreBlocks); // block data....

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(nurseryPublicStoreGetPublishBlocks({nurseryId: currentTabDynamic.nursery, nurseryTabId: currentTabDynamic._id}));
    }, [nurseryPublicStoreGetPublishBlocks]);

    const renderContents = content && content.map((elem) => {
        const blocksData = nurseryStoreBlocks && nurseryStoreBlocks.filter(blockData => (blockData.nurseryStoreTabs.toLowerCase() === currentTabDynamic._id.toLowerCase()) && blockData.nurseryStoreTemplates.toLocaleLowerCase() === elem._id.toLocaleLowerCase());

        const blocks = []; //? creating empty blocks of arrays....

        //* Sort blocks based on their index
        if(blocksData) {
            blocksData.forEach(e => {
                blocks[e.index] = e;
            });
        }


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
                <div className='template-in-use-container'>
                    {renderContents}
                </div>
            </div>
        </>
    );
}

export default NurseryTabsPublicView