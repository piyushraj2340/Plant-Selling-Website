import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import cover from '../Asset/img/cover.jpg';
import FullScreenImageView from './Shared/FullScreenImageView';
import Animation from './Shared/Animation';
import handelDataFetch from '../Controller/handelDataFetch';
import Info from './Shared/nurseryTab/Info';
import ChooseTemplate from './Shared/ChooseTemplate';
import { completeSection, twoSection, fourSection, twoSectionAndRightVertical, twoSectionAndRightFour, twoSectionAndLeftVertical, twoSectionAndLeftFour } from '../Controller/template';
import TabsViewEditing from './Shared/nurseryTab/TabsViewEditing';
import TabsViewSaved from './Shared/nurseryTab/TabsViewSaved';


function NurseryProfile() {
    document.title = "Manage Your Nursery"

    const [nursery, setNursery] = useState({
        user: "",
        nurseryOwnerName: "",
        nurseryName: "",
        nurseryEmail: "",
        nurseryPhone: "",
        address: "",
        avatar: {
            public_id: "",
            url: "",
        },
        avatarList: [
            {
                public_id: "",
                url: "",
            }
        ],
        cover: {
            public_id: "",
            url: "",
        },
        coverList: [
            {
                public_id: "",
                url: "",
            }
        ]
    });

    const [tabs, setTabs] = useState("Add new section");

    const [contents, setContents] = useState([]);

    const [isChooseModeOpen, setIsChooseModeOpen] = useState(false);
    const [atIndex, setAtIndex] = useState(null);

    const [showAnimation, setShowAnimation] = useState(false);

    const [isCollapseSideNav, setIsCollapseSideNav] = useState(false);

    const [isCurrentTab, setIsCurrentTab] = useState("info");

    const toggleTabSection = useRef("");

    const navigate = useNavigate();

    const defaultAvatarUrl = "https://res.cloudinary.com/dcd6y2awx/image/upload/v1708271684/PlantSeller/UI%20Images/urpbrgc7ibo1uyanacy6.jpg";

    const handleImageUploadNursery = async (e) => {
        setShowAnimation(true);
        try {
            e.preventDefault();

            const data = new FormData();

            data.append("type", e.target.name);
            data.append(e.target.name, e.target.files[0]);
            data.append("nurserId", nursery._id);

            const res = await fetch('/api/v2/nursery/profile/images', {
                method: "POST",
                body: data
            });

            const result = await res.json();

            if (result.status) {
                let value = null;
                if (e.target.name === "avatar") {
                    value = result.result.avatar;
                } else if (e.target.name === "cover") {
                    value = result.result.cover;
                }

                setNursery({ ...nursery, [e.target.name]: value });
            } else {
                throw new Error(result.message);
            }

        }
        catch (error) {
            console.log(error);
        } finally {
            setShowAnimation(false);
        }
    }


    const handelNurseryData = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/nursery/profile", method: "GET" }, setShowAnimation);

            if (result.status) {
                setNursery(result.result);
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    }

    const handelNurseryStoreData = async () => {
        try {
            const result = await handelDataFetch({ path: "/api/v2/nursery/store", method: "GET" }, setShowAnimation);

            if (result.status) {
                setContents(result.result);
            }

        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    }

    useEffect(() => {
        handelNurseryData();
        handelNurseryStoreData();

        const handelUndoTabSection = (event) => {
            if (toggleTabSection.current && !toggleTabSection.current.contains(event.target)) {
                setTabs("Add New Section");
            }
        }

        document.addEventListener('click', handelUndoTabSection);

        return () => {
            document.removeEventListener('click', handelUndoTabSection);
        }
    }, []);

    const handelSelectedTemplate = async (templateId) => {
        setIsChooseModeOpen(false);

        const contentIndex = contents.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        if (contentIndex !== -1) {
            const templateMap = {
                completeSection: completeSection,
                twoSection: twoSection,
                fourSection: fourSection,
                twoSectionAndRightVertical: twoSectionAndRightVertical,
                twoSectionAndRightFour: twoSectionAndRightFour,
                twoSectionAndLeftVertical: twoSectionAndLeftVertical,
                twoSectionAndLeftFour: twoSectionAndLeftFour
            };

            const templateObj = templateMap[templateId];

            const data = contents[contentIndex];
            data.user = nursery.user;
            data.nursery = nursery._id;

            if (atIndex === null) {
                templateObj.templateId = templateId;
                data.renders.push(templateObj);
            } else {
                templateObj.templateId = templateId;
                data.renders.splice(atIndex, 0, templateObj);
            }

            const result = await handelDataFetch({ path: `/api/v2/nursery/store/${data._id}`, method: "PATCH", body: data}, setShowAnimation);
            if(result.status) {
                handelNurseryStoreData();
            }
        } else alert("Error: Current Tabs not found.");
    }

    const handelAddNewSection = async () => {
        try {
            const contentInit = {
                user: nursery.user,
                nursery: nursery._id,
                tabName: tabs,
                renders: []
            }

            if (tabs !== "") {
                if (contents.some(content => content.tabName.toLocaleLowerCase() === tabs.toLocaleLowerCase())) {
                    alert("New Section is already exist.");
                } else {

                    const result = await handelDataFetch({ path: "/api/v2/nursery/store", method: "POST", body: contentInit }, setShowAnimation);

                    if (result.status) {
                        handelNurseryStoreData();
                    } else {
                        throw new Error(result.message);
                    }

                }
            } else {
                alert("New Section is required.");
            }
        } catch (error) {
            console.log(error);
            navigate('/login');
        }

    }

    const handelDeleteSection = async (id) => {
        try {
            

            const result = await handelDataFetch({ path: `/api/v2/nursery/store/${id}`, method: "DELETE" }, setShowAnimation);

            if (result.status) {
                handelNurseryStoreData();
                setIsCurrentTab("info")
            }

        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    }

    const handelEnterKeyAddNewSection = (event) => {
        if (event.key === "Enter") {
            handelAddNewSection();
            setTabs("")
        }
    }

    const handelDeleteRendersUpload = async (index) => {
        const contentIndex = contents.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        const newContents = [...contents];
        const renders = [...newContents[contentIndex].renders];

        // delete
        renders.splice(index, 1);

        newContents[contentIndex].renders = renders;

        const data = newContents[contentIndex];

        data.user = nursery.user;
        data.nursery = nursery._id;

        const result = await handelDataFetch({path: `/api/v2/nursery/store/${data._id}`, method: "PATCH", body: data}, setShowAnimation);

        if(result.status) {
            handelNurseryStoreData();
        }


    }

    const handelChangeRenderPosition = async (prev, next) => {
        const contentIndex = contents.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

        if (contentIndex !== -1) {
            const newContents = [...contents];
            const renders = [...newContents[contentIndex].renders];

            // swap 
            let temp = renders[prev];
            renders[prev] = renders[next];
            renders[next] = temp;

            newContents[contentIndex].renders = renders;

            const data = newContents[contentIndex];

            data.user = nursery.user;
            data.nursery = nursery._id;

            const result = await handelDataFetch({ path: `/api/v2/nursery/store/${data._id}`, method: "PATCH", body: data}, setShowAnimation);
            if(result.status) {
                setContents(newContents);
            }
            
        } else {
            alert("Error: Current Tabs not found.")
        }
    }

    const handleImageUploadNurseryStore = async (e, renderId, imageId) => {

        setShowAnimation(true);
        try {
            e.preventDefault();

            const contentIndex = contents.findIndex(content => content.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());

            const tabId = contents[contentIndex]._id;

            const data = new FormData();
            data.append(e.target.name, e.target.files[0]);
            data.append("nurserId", nursery._id);
            data.append("user", nursery.user);
            data.append("rendersId", renderId);
            data.append("tabId", tabId);

            const res = await fetch(`/api/v2/nursery/store/images/${imageId}`, {
                method: "POST",
                body: data
            });

            const result = await res.json();

            if (result.status) {
                handelNurseryStoreData();
            } else {
                throw new Error(result.message);
            }

        }
        catch (error) {
            console.log(error);
        } finally {
            setShowAnimation(false);
        }
    }


    const [content] = contents.filter(elem => elem.tabName.toLocaleLowerCase() === isCurrentTab.toLocaleLowerCase());


    return (
        <>
            <section style={{ backgroundColor: "#eee" }}>
                <div className="container py-3">
                    <div className="row mb-2">
                        <div className="nursery-header">
                            <div className="cover-image">
                                <div className="image rounded">
                                    <img src={nursery.cover.url || cover} alt="Nursery Cover" className='img-fluid' data-toggle="modal" data-target="#nursery-cover-img-full-size" />
                                </div>
                                <div className="btn-upload-cover">
                                    <label htmlFor="cover" className='bg-danger' data-toggle="tooltip" data-bs-placement="left" title='Upload Cover Image'>
                                        <i className="fas fa-image"> </i>
                                    </label>
                                    <input type="file" name="cover" id="cover" accept="image/png, image/jpeg" onChange={handleImageUploadNursery} hidden />
                                </div>
                            </div>
                            <FullScreenImageView img={nursery.cover.url !== "" ? nursery.cover.url : cover} id="nursery-cover-img-full-size" />
                            <div className="nursery-info ">
                                <div className="info d-flex flex-column flex-md-row justify-content-between">
                                    <div className='d-flex flex-wrap align-items-start justify-content-start'>
                                        <div className="avatar mx-1 mx-sm-2 mx-md-3 bg-secondary border border-dark p-1 border-4 rounded-circle">
                                            <img src={nursery.avatar.url !== "" ? nursery.avatar.url : defaultAvatarUrl} alt="avatar"
                                                className="rounded-circle img-fluid" data-toggle="modal" data-target="#nursery-avatar-img-full-size" />
                                            <div className="btn-upload-avatar">
                                                <label htmlFor="avatar" data-toggle="tooltip" data-bs-placement="right" title='upload avatar image'>
                                                    <i className="fas fa-camera"> </i>
                                                </label>
                                                <input type="file" name="avatar" id="avatar" accept="image/png, image/jpeg" onChange={handleImageUploadNursery} hidden />
                                            </div>
                                        </div>
                                        <div className="nursery-name ms-1 mb-2">
                                            <h6 className="my-1 h6">{nursery.nurseryName}</h6>
                                            <p className="mb-2 d-flex align-items-center text-muted" style={{ fontSize: "12px" }}>{nursery.nurseryOwnerName}</p>
                                        </div>
                                    </div>
                                    <div className='option d-flex justify-content-end col col-md-6 mt-2'>
                                        <div className="option-nav mb-2 d-flex flex-wrap justify-content-end">
                                            <div className="mx-1 my-1">
                                                <Link to={'/dashboard'} className="btn btn-sm btn-light border-dark d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>dashboard</i> Dashboard</Link>
                                            </div>
                                            <div className="mx-1 my-1">
                                                <Link to={'/nursery/plant/add'} className="btn btn-sm btn-light border-dark"><i className="fas fa-plus"></i> Plants</Link>
                                            </div>
                                            <div className="mx-1 my-1">
                                                <Link to={`/nursery/update/${nursery._id}`} className="btn btn-sm btn-light border-dark"><i className="fas fa-pen"></i> Nursery</Link>
                                            </div>
                                            <div className="mx-1 my-1">
                                                <Link to={`/nursery/store/view/${nursery._id}`} className="btn btn-sm btn-light border-dark d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>public</i> Public</Link>
                                            </div>
                                        </div>
                                        <div className="mx-1 my-1 dropdown d-lg-none">
                                            <button type='button' id='getMoreMenu' className="btn btn-sm btn-light border-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">More</button>
                                            <div className="dropdown-menu dropdown-menu-right py-0 " aria-labelledby="getMoreMenu">
                                                <div className="p-2 border-bottom">
                                                    <Link to={'/dashboard'} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>dashboard</i> Dashboard</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={'/nursery/plant/add'}><i className="fas fa-plus"></i> Plants</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`/nursery/update/${nursery._id}`}><i className="fas fa-pen"></i> Nursery</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`/nursery/store/view/${nursery._id}`} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>public</i> Public</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`/nursery/plants`} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>forest</i> View Plants</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`nursery/order/track`}><i className="fas fa-truck"></i> Track Shipment</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`/nursery/order`}><i className="fas fa-history"></i> Manage Order</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`/nursery/plant/add`}><i className="fas fa-tree"></i> Add Plant</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`/nursery/settings`}><i className="fa fa-gear"></i> Settings</Link>
                                                </div>
                                                <div className="p-2 border-bottom">
                                                    <Link to={`/logout`}><i className="fa fa-sigh-out"></i> Logout</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <FullScreenImageView img={nursery.avatar.url !== "" ? nursery.avatar.url : defaultAvatarUrl} id="nursery-avatar-img-full-size" />
                            </div>
                        </div>
                    </div>
                    <div className="row nursery-content-sticky">
                        <div className="bg-white p-0 rounded d-none d-lg-block position-relative nursery-side-nav" style={isCollapseSideNav ? { width: '58px' } : { width: '25%' }}>
                            <div className="mb-4 mb-lg-0">
                                <div className="p-0">
                                    <div className="">
                                        <Link to={"/nursery/plants"}>
                                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Manage Your Plants'>
                                                <i className="text-warning material-symbols-outlined">forest</i>
                                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Manage Your Plants</p>
                                            </div>
                                        </Link>
                                        <Link to={"/nursery/order/track"}>
                                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Track Your Shipment'>
                                                <i className="fas fa-truck fa-lg text-warning"></i>
                                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Track Your Shipment</p>
                                            </div>
                                        </Link>
                                        <Link to={"/nursery/order"}>
                                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Manage Your Orders'>
                                                <i className="fas fa-history fa-lg text-warning"></i>
                                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Manage Your Orders</p>
                                            </div>
                                        </Link>
                                        <Link to={"/nursery/plant/add"}>
                                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Add Selling Plants'>
                                                <i className="fas fa-tree fa-lg text-warning"></i>
                                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Add Selling Plants</p>
                                            </div>
                                        </Link>
                                        <Link to={"/nursery/settings"}>
                                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Settings'>
                                                <i className="fa fa-gear fa-lg text-warning"></i>
                                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Settings</p>
                                            </div>
                                        </Link>
                                        <Link to={"/logout"}>
                                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: "57px" }} data-toggle="tooltip" data-bs-placement="right" title='Logout'>
                                                <i className="fa fa-sign-out text-warning"></i>
                                                <p className={`m-0 text-nowrap overflow-hidden ${isCollapseSideNav && 'd-none'}`}>Logout</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className={`nursery-collapse-side p-1 open ${!isCollapseSideNav && 'd-none'}`} data-toggle="tooltip" data-bs-placement="right" title='Open Slider' onClick={() => setIsCollapseSideNav(!isCollapseSideNav)}>
                                <div className="bar bar1"></div>
                                <div className="bar bar2"></div>
                            </div>
                            <div className={`nursery-collapse-side p-1 close ${isCollapseSideNav && 'd-none'}`} data-toggle="tooltip" data-bs-placement="right" title='Close Slider' onClick={() => setIsCollapseSideNav(!isCollapseSideNav)}>
                                <div className="bar bar1"></div>
                                <div className="bar bar2"></div>
                            </div>
                        </div>
                        <div className='nursery-main-content' style={isCollapseSideNav ? { width: 'calc(100% - 58px)' } : { width: '75%' }}>
                            <div className='p-2 p-md-3 p-lg-4 border rounded bg-light'>
                                <div className="main-content mb-4">
                                    <div className="nav-tab border-bottom border-black py-2 mb-3 d-flex flex-wrap justify-content-start">
                                        <button className={`btn btn-tab bg-light mt-2 ${isCurrentTab === "info" && "viewing border-black"}`} onClick={() => { setIsCurrentTab("info") }}>Nursery Info</button>

                                        {
                                            contents.map((content, index) => {
                                                return <button key={index} className={`btn btn-tab bg-light mt-2 ${isCurrentTab === content.tabName && "viewing border-black"}`} onClick={() => setIsCurrentTab(content.tabName)}>{content.tabName}</button>
                                            })
                                        }

                                        <span ref={toggleTabSection} className='btn btn-tab d-flex align-items-center btn bg-light p-0 m-0 btn-to-input-container' onClick={() => { setTabs("") }}>
                                            <input type={tabs.toLocaleLowerCase() !== "add new section" ? "text" : "button"} className={`btn-to-input btn text-start`} placeholder='Add New Section' onChange={(e) => setTabs(e.target.value)} value={tabs} onKeyDown={handelEnterKeyAddNewSection} />
                                            {tabs.toLocaleLowerCase() !== "add new section" && <button className="btn btn-info m-0 d-flex align-items-center justify-content-center" onClick={handelAddNewSection}><i className='material-symbols-outlined'>add</i></button>}
                                        </span>
                                    </div>
                                    <div className="content">
                                        {

                                            content ?
                                                content.status.toLocaleLowerCase() === "draft" ?
                                                    <TabsViewEditing content={content} setAtIndex={setAtIndex} setIsChooseModeOpen={setIsChooseModeOpen} handelChangeRenderPosition={handelChangeRenderPosition} handelDeleteSection={handelDeleteSection} handelDeleteRendersUpload={handelDeleteRendersUpload} handleImageUploadNurseryStore={handleImageUploadNurseryStore} />
                                                    :

                                                    <TabsViewSaved content={content} />
                                                :

                                                <Info nursery={nursery} />

                                            // <TabsViewEditing content={content} setAtIndex={setAtIndex} setIsChooseModeOpen={setIsChooseModeOpen} handelChangeRenderPosition={handelChangeRenderPosition} />
                                            // isCurrentTab === 'info' ? <Info nursery={nursery} /> : <TabsViewEditing content={content} setAtIndex={setAtIndex} setIsChooseModeOpen={setIsChooseModeOpen} handelChangeRenderPosition={handelChangeRenderPosition} handelDeleteSection={handelDeleteSection}/>
                                            // <TabsViewSaved content={content}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showAnimation && <Animation />}
            {isChooseModeOpen && <ChooseTemplate setIsChooseModeOpen={setIsChooseModeOpen} handelSelectedTemplate={handelSelectedTemplate} />}
        </>

    )
}

export default NurseryProfile