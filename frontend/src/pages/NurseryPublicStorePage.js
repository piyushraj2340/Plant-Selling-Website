import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TabsViewSaved from '../features/nursery/Components/NurseryTab/TabsViewSaved'
import NurseryHeaderPublic from '../features/nursery/Components/NurseryPublicStore/NurseryHeaderPublic';
// import NurseryStoreView from '../features/nursery/Components/NurseryPublicStore/NurseryStoreView'
import NurseryTabsPublic from '../features/nursery/Components/NurseryPublicStore/NurseryTabsPublic';
import NurseryStoreAllProducts from '../features/nursery/Components/NurseryPublicStore/NurseryStoreAllProducts';
import { nurseryPublicStoreDetails, nurseryPublicStoreGetPublishTabs } from '../features/nursery/nurseryPublicStoreSlice';
import { useParams } from 'react-router-dom';
import Error404 from './Error404Page';
import NurseryStoreContactUs from '../features/nursery/Components/NurseryPublicStore/NurseryStoreContactUs';
import NurseryPublicViewMain from '../features/nursery/Components/NurseryPublicStore/NurseryPublicViewMain';
import NoDataFound from '../features/common/NoDataFound';
import Animation from '../features/common/Animation';

const NurseryPublicStorePage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const initialActiveTab = queryParams.get('activeTab') || 'products';

  const [isCurrentTab, setIsCurrentTab] = useState(initialActiveTab);

  const [currentTabDynamic, setCurrentTabDynamic] = useState(null);

  const nurseryPublicStoresDetails = useSelector(state => state.nurseryPublicStore.nurseryPublicStoresDetails);
  const isLoading = useSelector(state => state.nurseryPublicStore.isLoading);

  const dispatch = useDispatch();

  const params = useParams();
  const _id = params.id;

  const nurseryPublicStore = nurseryPublicStoresDetails.find(n => n._id === _id);

  useEffect(() => {
    if (!nurseryPublicStoresDetails || nurseryPublicStoresDetails.length === 0 || !nurseryPublicStore) {
      dispatch(nurseryPublicStoreDetails(_id));
    }
  }, []);

  let render;

  if (isCurrentTab.toLocaleLowerCase() == "products") {
    render = <NurseryStoreAllProducts nurseryPublicStore={nurseryPublicStore} />
  }
  // else if (isCurrentTab.toLowerCase() === "aboutus") {
  //   render = <div>About Us</div>
  // }
  else if (isCurrentTab.toLowerCase() == "contactus") {
    render = <NurseryStoreContactUs nurseryPublicStore={nurseryPublicStore} />
  }
  else {
    render = currentTabDynamic ? <NurseryPublicViewMain nurseryPublicStore={nurseryPublicStore} currentTabDynamic={currentTabDynamic} isCurrentTab={isCurrentTab} /> : (isLoading ? null : <NoDataFound link="/" message="No Information Found" />)
  }


  return (
    <>
      {nurseryPublicStore ?
        <section style={{ backgroundColor: "#eee" }}>
          <div className="container py-3">
            <div className="row mb-2">
              <NurseryHeaderPublic _id={_id} />
            </div>
            <div className="row nursery-content-sticky">
              <div className='nursery-main-content'>
                <div className='p-2 p-md-3 p-lg-4 border rounded bg-light'>
                  <div className="main-content mb-4">
                    <NurseryTabsPublic _id={_id} isCurrentTab={isCurrentTab} setIsCurrentTab={setIsCurrentTab} setCurrentTabDynamic={setCurrentTabDynamic} />
                    <div className="content">
                      {render}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        :
        (isLoading ? null : <Error404 />)
      }
      {isLoading && <Animation />}
    </>
  )
}

export default NurseryPublicStorePage