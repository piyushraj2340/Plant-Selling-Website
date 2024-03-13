import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { nurseryProfileImagesUpload } from '../nurserySlice';
// TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES 
// import FullScreenImageView from '../../common/FullScreenImageView';

const NurseryHeader = () => {
    const nursery = useSelector(state => state.nursery.nursery);
    const dispatch = useDispatch();

    const cover = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-cover-header";
    const defaultAvatarUrl = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-avatar-header";

    const handleImageUploadNursery = async (e) => {
            e.preventDefault();

            const data = new FormData();

            data.append("type", e.target.name);
            data.append(e.target.name, e.target.files[0]);
            data.append("nurserId", nursery._id);

            dispatch(nurseryProfileImagesUpload(data));
    }

    return (
        nursery &&
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
            {/* // TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES  */}
            {/* <FullScreenImageView img={nursery.cover.url !== "" ? nursery.cover.url : cover} id="nursery-cover-img-full-size" /> */}
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
                                <Link to={'/nursery/plant/new'} className="btn btn-sm btn-light border-dark"><i className="fas fa-plus"></i> Plants</Link>
                            </div>
                            <div className="mx-1 my-1">
                                <Link to={`/nursery/update`} className="btn btn-sm btn-light border-dark"><i className="fas fa-pen"></i> Nursery</Link>
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
                                    <Link to={'/nursery/plant/new'}><i className="fas fa-plus"></i> Plants</Link>
                                </div>
                                <div className="p-2 border-bottom">
                                    <Link to={`/nursery/update`}><i className="fas fa-pen"></i> Nursery</Link>
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
                {/* // TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES  */}
                {/* <FullScreenImageView img={nursery.avatar.url !== "" ? nursery.avatar.url : defaultAvatarUrl} id="nursery-avatar-img-full-size" /> */}
            </div>
        </div>
    )
}

export default NurseryHeader