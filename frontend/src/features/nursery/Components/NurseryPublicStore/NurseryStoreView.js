import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../App';
import { useNavigate, Link } from 'react-router-dom';
import cover from '../Asset/img/cover.jpg';
// import FullScreenImageView from './Shared/FullScreenImageView';
import handelDataFetch from '../../../../utils/handelDataFetch';

const NurseryStoreView = () => {
    // Page title is after the nursery useState hooks

    const { setShowAnimation } = useContext(UserContext);

    const [nursery, setNursery] = useState({
        nursery: "",
        nurseryName: "",
        address: "",
        avatar: {
            public_id: "",
            url: "",
        },
        cover: {
            public_id: "",
            url: "",
        },
    });

    document.title = nursery.nurseryName || "Public Store";

    const navigate = useNavigate();

    const defaultAvatarUrl = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";

    const handelNurseryPublicData = async () => { //Update: update the public route and then update 
        try {
            const result = await handelDataFetch({ path: "/api/v2/nursery", method: "GET" }, setShowAnimation);

            if (result.status) {
                setNursery(result.result);
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error(error);
            navigate('/login');
        }
    }

    useEffect(() => {
        handelNurseryPublicData();
    }, []);

    return (
        <section style={{ backgroundColor: "#eee" }}>
            <div className="container py-3">
                <div className="row mb-2">
                    <div className="public-nursery-header">
                        <div className="cover-image">
                            <div className="image rounded">
                                <img src={nursery.cover.url || cover} alt="Nursery Cover" className='img-fluid' data-toggle="modal" data-target="#nursery-cover-img-full-size" />
                            </div>
                        </div>
                        {/* <FullScreenImageView img={nursery.cover.url !== "" ? nursery.cover.url : cover} id="nursery-cover-img-full-size" /> */}
                        <div className="nursery-info">
                            <div className="info d-flex flex-column flex-md-row justify-content-between">
                                <div className='d-flex flex-wrap align-items-start justify-content-start'>
                                    <div className="avatar mx-1 mx-sm-2 mx-md-3 bg-secondary border border-dark p-1 border-4 rounded-circle">
                                        <img src={nursery.avatar.url !== "" ? nursery.avatar.url : defaultAvatarUrl} alt="avatar"
                                            className="rounded-circle img-fluid" data-toggle="modal" data-target="#nursery-avatar-img-full-size" />
                                    </div>
                                    <div className="ms-1">
                                        <h6 className="my-1 h6">{nursery.nurseryName}</h6>
                                        <p className="mt-2">
                                            <button className="btn btn-sm btn-light border border-black mb-2 d-flex align-items-center" style={{ fontSize: "12px" }}> <i className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</i> Follow</button>
                                        </p>
                                    </div>
                                </div>
                                <div className='option d-flex justify-content-end col col-md-6 mt-2'>
                                    <div className="option-nav mb-2 d-flex flex-wrap justify-content-end">
                                        <div className="mx-1 my-1">
                                            <Link to={'/dashboard'} className="btn btn-sm btn-light border-dark d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>dashboard</i> Dashboard</Link>
                                        </div>
                                        <div className="mx-1 my-1">
                                            <Link to={'/nursery/plant/new'} className="btn btn-sm btn-light border-dark"><i className="fas fa-plus"></i> Plants</Link>
                                        </div>
                                        <div className="mx-1 my-1">
                                            <Link to={`/nursery/update/${nursery._id}`} className="btn btn-sm btn-light border-dark"><i className="fas fa-pen"></i> Nursery</Link>
                                        </div>
                                        <div className="mx-1 my-1">
                                            <Link to={`/nursery/public/view/${nursery._id}`} className="btn btn-sm btn-light border-dark d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>public</i> Public</Link>
                                        </div>
                                    </div>
                                    <div className="mx-1 my-1 dropdown d-lg-none">
                                        <button type='button' id='getMoreMenu' className="btn btn-sm btn-light border-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">More</button>
                                        <div className="dropdown-menu dropdown-menu-right py-0 " aria-labelledby="getMoreMenu">
                                            <div className="p-2 border-bottom">
                                                <Link to={'/dashboard'} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>dashboard</i> Dashboard</Link>
                                            </div>
                                            <div className="p-2 border-bottom">
                                                <Link to={'/nursery/plant/new'}><i className="fas fa-plus"></i> Plants</Link>
                                            </div>
                                            <div className="p-2 border-bottom">
                                                <Link to={`/nursery/update/${nursery._id}`}><i className="fas fa-pen"></i> Nursery</Link>
                                            </div>
                                            <div className="p-2 border-bottom">
                                                <Link to={`/nursery/public/view/${nursery._id}`} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>public</i> Public</Link>
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
                                                <Link to={`/nursery/plant/new`}><i className="fas fa-tree"></i> Add Plant</Link>
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
                            {/* <FullScreenImageView img={nursery.avatar.url !== "" ? nursery.avatar.url : defaultAvatarUrl} id="nursery-avatar-img-full-size" /> */}
                        </div>
                    </div>
                </div>
                {/* style={{fontSize: "12px"}} */}
                <div className="row">

                </div>
            </div>
        </section>

    )
}

export default NurseryStoreView