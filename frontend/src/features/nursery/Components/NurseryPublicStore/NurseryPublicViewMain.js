import React, { useEffect } from 'react'
import NurseryTabsPublicView from './NurseryTabsPublicView'
import { useDispatch, useSelector } from 'react-redux';
import { nurseryPublicStoreGetPublishTemplates } from '../../nurseryPublicStoreSlice';

const NurseryPublicViewMain = ({nurseryPublicStore, currentTabDynamic, isCurrentTab}) => {

    document.title = nurseryPublicStore.nurseryName + " - " + currentTabDynamic.tabName;

    const nurseryStoreTemplatesAll = useSelector(state => state.nurseryPublicStore.nurseryPublicStoreTemplates);
    const nurseryStoreTemplates = nurseryStoreTemplatesAll.filter(t => t.nurseryStoreTabs === currentTabDynamic._id);

    const dispatch = useDispatch();

    useEffect(() => {
        nurseryStoreTemplates && nurseryStoreTemplates.length === 0 && dispatch(nurseryPublicStoreGetPublishTemplates({nurseryId: nurseryPublicStore._id, nurseryTabId: currentTabDynamic._id}));
    }, []);

    return (
        <NurseryTabsPublicView content={nurseryStoreTemplates.sort((obj1, obj2) => obj1.index - obj2.index)} isCurrentTab={isCurrentTab} currentTabDynamic={currentTabDynamic}/>
    )
}

export default NurseryPublicViewMain