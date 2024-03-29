import React from 'react'
import { useSelector } from 'react-redux';
import FullScreenImageView from '../../common/FullScreenImageView';

const ProfileAvatar = () => {
    const user = useSelector(state => state.user.user);
    return (
        <div className="card mb-2">
            <div className="card-body text-center">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                    className="rounded-circle img-fluid" style={{ width: "150px" }} data-toggle="modal" data-target="#profile-img-full-size" />
                <h5 className="my-3">{user.name}</h5>
                <p className="text-muted mb-1">{user.email}</p>
            </div>
            <FullScreenImageView img="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" id="profile-img-full-size" />
        </div>
    )
}

export default ProfileAvatar