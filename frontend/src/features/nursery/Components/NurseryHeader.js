import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { nurseryProfileImagesUpload } from '../nurserySlice';
import ImageCropperModal from './ImageCropperModal';
// TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES 
// import FullScreenImageView from '../../common/FullScreenImageView';

const NurseryHeader = () => {
    const nursery = useSelector(state => state.nursery.nursery);
    const dispatch = useDispatch();

    const cover = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-cover-header";
    const defaultAvatarUrl = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-avatar-header";

    const [cropper, setCropper] = useState({ isOpen: false, imageSrc: null, type: null, aspect: 1 });

    const handleImageUploadNursery = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const type = e.target.name;
            const aspect = type === 'avatar' ? 1 : 4 / 1; // 1:1 for logo, 4:1 for cover

            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setCropper({ isOpen: true, imageSrc: reader.result, type, aspect })
            );
            reader.readAsDataURL(file);
        }
        e.target.value = null;
    }

    const handleCropComplete = (croppedBlob) => {
        const data = new FormData();
        data.append("type", cropper.type);
        data.append(cropper.type, croppedBlob, `${cropper.type}.jpg`);
        data.append("nurserId", nursery._id);

        dispatch(nurseryProfileImagesUpload(data));
        setCropper({ isOpen: false, imageSrc: null, type: null, aspect: 1 });
    }

    const handleCropCancel = () => {
        setCropper({ isOpen: false, imageSrc: null, type: null, aspect: 1 });
    }

    return (
        nursery && (
        <>
            <div className="nursery-header">
            <div className="cover-image">
                <div className="image rounded">
                    <img src={nursery.cover.url || cover} alt="Nursery Cover" className='img-fluid' data-toggle="modal" data-target="#nursery-cover-img-full-size" />
                </div>
                <div className="btn-upload-cover">
                    <label htmlFor="cover" data-toggle="tooltip" data-bs-placement="left" title='Upload Cover Image'>
                        <i className="fas fa-camera"> </i>
                    </label>
                    <input type="file" name="cover" id="cover" accept="image/png, image/jpeg" onChange={handleImageUploadNursery} hidden />
                </div>
            </div>
            {/* // TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES  */}
            {/* <FullScreenImageView img={nursery.cover.url !== "" ? nursery.cover.url : cover} id="nursery-cover-img-full-size" /> */}
            <div className="nursery-info ">
                <div className="info d-flex flex-column flex-md-row justify-content-between">
                    <div className='d-flex flex-wrap align-items-start justify-content-start'>
                        <div className="avatar mx-1 mx-sm-2 mx-md-3">
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
                                <Link to={'/dashboard'} className="btn btn-sm btn-light rounded-pill border-0 shadow-sm d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "18px" }}>dashboard</i> Dashboard</Link>
                            </div>
                            <div className="mx-1 my-1">
                                <Link to={'/nursery/plants?action=add-plant'} className="btn btn-sm btn-light rounded-pill border-0 shadow-sm"><i className="fas fa-plus"></i> Plants</Link>
                            </div>
                            <div className="mx-1 my-1">
                                <Link to={`/nursery/settings?tab=general-profile`} className="btn btn-sm btn-light rounded-pill border-0 shadow-sm"><i className="fas fa-pen"></i> Nursery</Link>
                            </div>
                            <div className="mx-1 my-1">
                                <Link to={`/nursery/store/view/${nursery._id}`} className="btn btn-sm btn-light rounded-pill border-0 shadow-sm d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "18px" }}>public</i> Public</Link>
                            </div>
                        </div>
                        <div className="mx-1 my-1 dropdown d-lg-none">
                            <button type='button' id='getMoreMenu' className="btn btn-sm btn-light border-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">More</button>
                            <div className="dropdown-menu dropdown-menu-right py-0 " aria-labelledby="getMoreMenu">
                                <div className="p-2 border-bottom">
                                    <Link to={'/dashboard'} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>dashboard</i> Dashboard</Link>
                                </div>
                                <div className="p-2 border-bottom">
                                    <Link to={'/nursery/plants?action=add-plant'}><i className="fas fa-plus"></i> Plants</Link>
                                </div>
                                <div className="p-2 border-bottom">
                                    <Link to={`/nursery/settings?tab=general-profile`}><i className="fas fa-pen"></i> Nursery</Link>
                                </div>
                                <div className="p-2 border-bottom">
                                    <Link to={`/nursery/store/view/${nursery._id}`} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>public</i> Public</Link>
                                </div>
                                <div className="p-2 border-bottom">
                                    <Link to={`/nursery/plants`} className="d-flex align-items-center"><i className="material-symbols-outlined me-1" style={{ fontSize: "20px" }}>forest</i> View Plants</Link>
                                </div>
                                <div className="p-2 border-bottom">
                                    <Link to={`/nursery/order`}><i className="fas fa-history"></i> Manage Order</Link>
                                </div>
                                <div className="p-2 border-bottom">
                                    <Link to={`/nursery/plants?action=add-plant`}><i className="fas fa-tree"></i> Add Plant</Link>
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
            
            {cropper.isOpen && (
                <ImageCropperModal 
                    imageSrc={cropper.imageSrc} 
                    aspect={cropper.aspect} 
                    onCropComplete={handleCropComplete} 
                    onCancel={handleCropCancel} 
                />
            )}
        </>
        )
    )
}

export default NurseryHeader