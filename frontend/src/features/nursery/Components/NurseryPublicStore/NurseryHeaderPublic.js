import React from 'react'
import { useSelector } from 'react-redux';

const NurseryHeaderPublic = ({ _id }) => {
    const nurseryPublicStoresDetails = useSelector(state => state.nurseryPublicStore.nurseryPublicStoresDetails);

    const nurseryPublicStore = nurseryPublicStoresDetails.find(n => n._id === _id);

    const cover = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-cover-header";
    const defaultAvatarUrl = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-avatar-header";

    return (
        <div className="nursery-header">
            <div className="cover-image">
                <div className="image rounded">
                    <img src={nurseryPublicStore.cover.url || cover} alt="Nursery Cover" className='img-fluid' data-toggle="modal" data-target="#nursery-cover-img-full-size" />
                </div>
            </div>
            {/* // TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES  */}
            {/* <FullScreenImageView img={nursery.cover.url !== "" ? nursery.cover.url : cover} id="nursery-cover-img-full-size" /> */}
            <div className="nursery-info ">
                <div className="info d-flex flex-column flex-md-row justify-content-between">
                    <div className='d-flex flex-wrap align-items-start justify-content-start'>
                        <div className="avatar mx-1 mx-sm-2 mx-md-3 bg-secondary border border-dark p-1 border-4 rounded-circle">
                            <img src={nurseryPublicStore.avatar.url !== "" ? nurseryPublicStore.avatar.url : defaultAvatarUrl} alt="avatar"
                                className="rounded-circle img-fluid" data-toggle="modal" data-target="#nursery-avatar-img-full-size" />
                        </div>
                        <div className="nursery-name ms-1 mb-2">
                            <h6 className="my-1 h6">{nurseryPublicStore.nurseryName}</h6>
                            <p className="mb-2 d-flex align-items-center text-muted" style={{ fontSize: "12px" }}>seller</p>
                        </div>
                    </div>

                </div>
                {/* // TODO: FIX THE ISSUE FOR THE NURSERY HEADER IMAGES OR CREATE YOUR OWN MODEL FOR THE IMAGES  */}
                {/* <FullScreenImageView img={nursery.avatar.url !== "" ? nursery.avatar.url : defaultAvatarUrl} id="nursery-avatar-img-full-size" /> */}
            </div>
        </div>
    )
}

export default NurseryHeaderPublic