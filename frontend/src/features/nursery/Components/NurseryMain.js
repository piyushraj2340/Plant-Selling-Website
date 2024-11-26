import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TabsViewEditing from './NurseryTab/TabsViewEditing';
import TabsViewSaved from './NurseryTab/TabsViewSaved';
import Info from './NurseryTab/Info';
import { nurseryProfileAsync, nurseryStoreDataAsync, nurseryStoreTabsGetAllAsync, nurseryStoreTemplatesGetAllAsync, nurseryStoreBlocksGetAllAsync } from '../nurserySlice';
import NurseryTabs from './NurseryTabs';

const NurseryMain = ({ isCollapseSideNav }) => {

    const nursery = useSelector(state => state.nursery.nursery);
    const nurseryStoreTabs = useSelector(state => state.nursery.nurseryStoreTabs);
    const nurseryStoreTemplates = useSelector(state => state.nursery.nurseryStoreTemplates);
    const nurseryStoreBlocks = useSelector(state => state.nursery.nurseryStoreBlocks);
    const isCurrentTab = useSelector(state => state.nursery.isCurrentTab);

    const dispatch = useDispatch();

    useEffect(() => {
        !nursery && dispatch(nurseryProfileAsync());
        nursery && dispatch(nurseryStoreTabsGetAllAsync());
    }, []);

    const [nurseryStoreTabsSelected] = nurseryStoreTabs && nurseryStoreTabs.filter(elem => elem._id.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

    //? FILTER_OUT_TEMPLATES_WITH_TABS_ID
    const content = nurseryStoreTemplates.filter(data => data.nurseryStoreTabs.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase()).sort((obj1, obj2) => obj1.index - obj2.index);


    return (
        <div className='nursery-main-content' style={isCollapseSideNav ? { width: 'calc(100% - 58px)' } : { width: '75%' }}>
            <div className='p-2 p-md-3 p-lg-4 border rounded bg-light'>
                <div className="main-content mb-4">
                    <NurseryTabs />
                    <div className="content">
                        {

                            nurseryStoreTabsSelected ?
                                nurseryStoreTabsSelected.status.toLocaleLowerCase() === "draft" ?
                                    <TabsViewEditing content={content} status={nurseryStoreTabsSelected.status} />
                                    :

                                    <TabsViewSaved content={content} status={nurseryStoreTabsSelected.status} />
                                :

                                <Info />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NurseryMain