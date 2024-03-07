import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TabsViewEditing from './NurseryTab/TabsViewEditing';
import TabsViewSaved from './NurseryTab/TabsViewSaved';
import Info from './NurseryTab/Info';
import { nurseryProfileAsync, nurseryStoreDataAsync } from '../nurserySlice';
import NurseryTabs from './NurseryTabs';

const NurseryMain = ({ isCollapseSideNav }) => {

    const nursery = useSelector(state => state.nursery.nursery);
    const nurseryStore = useSelector(state => state.nursery.nurseryStore);
    const isCurrentTab = useSelector(state => state.nursery.isCurrentTab);

    const dispatch = useDispatch();

    useEffect(() => {
        !nursery && dispatch(nurseryProfileAsync());
        nursery && dispatch(nurseryStoreDataAsync());
    }, []);


    const [content] = nurseryStore && nurseryStore.filter(elem => elem.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

    return (
        <div className='nursery-main-content' style={isCollapseSideNav ? { width: 'calc(100% - 58px)' } : { width: '75%' }}>
            <div className='p-2 p-md-3 p-lg-4 border rounded bg-light'>
                <div className="main-content mb-4">
                    <NurseryTabs />
                    <div className="content">
                        {

                            content ?
                                content.status.toLocaleLowerCase() === "draft" ?
                                    <TabsViewEditing content={content} />
                                    :

                                    <TabsViewSaved content={content} />
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