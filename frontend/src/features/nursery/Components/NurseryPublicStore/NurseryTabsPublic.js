import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nurseryPublicStoreGetPublishTabs } from '../../nurseryPublicStoreSlice';
import { useNavigate } from 'react-router-dom';

const NurseryTabsPublic = ({_id, isCurrentTab, setIsCurrentTab, setCurrentTabDynamic}) => {

  const nurseryPublicStoreTabsAll = useSelector(state =>  state.nurseryPublicStore.nurseryPublicStoreTabs);

  const nurseryPublicStoreTabs = nurseryPublicStoreTabsAll.filter(t => t.nursery === _id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    if(nurseryPublicStoreTabs && nurseryPublicStoreTabs.length > 0) {
      if(nurseryPublicStoreTabs.findIndex(t => t.tabName.split(' ').join('').toLowerCase() === isCurrentTab.toLowerCase()) === -1 && isCurrentTab.toLowerCase() !== "aboutus" && isCurrentTab.toLowerCase() !== "contactus") {
        setIsCurrentTab("products");
      }
    }

    if(!nurseryPublicStoreTabs || nurseryPublicStoreTabs.length === 0) {
      dispatch(nurseryPublicStoreGetPublishTabs(_id));
    }
  }, [nurseryPublicStoreTabsAll]);

  const handelChangeCurrentTab = (query) => {
    navigate(`/nursery/store/view/${_id}/?activeTab=${query}`);
    setIsCurrentTab(query);
  }

  return (
    <div className="nav-tab border-bottom border-black py-2 mb-3 d-flex flex-wrap justify-content-start">
      <button className={`btn btn-tab bg-light mt-2 ${isCurrentTab.toLowerCase() === "products" && "viewing border-black"}`} onClick={() => handelChangeCurrentTab("products")}>Products</button>

      {
        nurseryPublicStoreTabs.sort((f,s) => f.index < s.index).map(t => {
          return <button key={t._id} className={`btn btn-tab bg-light mt-2 ${isCurrentTab.toLowerCase() === t.tabName.split(" ").join("").toLowerCase() && "viewing border-black"}`} onClick={() => {handelChangeCurrentTab(t.tabName.split(" ").join("").toLowerCase()); setCurrentTabDynamic(t)}}>{t.tabName}</button>
        })
      }

      {/* <button className={`btn btn-tab bg-light mt-2 ${isCurrentTab.toLowerCase() === "aboutus" && "viewing border-black"}`} onClick={() => handelChangeCurrentTab("aboutUs")}>About Us</button> */}
      <button className={`btn btn-tab bg-light mt-2 ${isCurrentTab.toLowerCase() === "contactus" && "viewing border-black"}`} onClick={() => handelChangeCurrentTab("contactUs")}>Contact Us</button>
    </div>
  )
}

export default NurseryTabsPublic