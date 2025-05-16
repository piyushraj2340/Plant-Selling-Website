import React from 'react'
import ProfileAvatar from '../features/user/Components/ProfileAvatar';
import ProfileSideNav from '../features/user/Components/ProfileSideNav';
import useUserData from '../hooks/useUserData';
import { Outlet } from 'react-router-dom';

const ProfilePage = () => {
    document.title = "Profile";

    const {userData:user} = useUserData();

    return (
        // TODO: add the customizations avatar images based on the gender.
        <section className='bg-section'>
            {
                user &&
                <div className="container py-5">
                    <div className="row">
                        <div className="col-lg-4">
                            <ProfileAvatar />
                            <ProfileSideNav />
                        </div>
                        <div className="col-lg-8">
                            <Outlet />
                        </div>
                    </div>
                </div>
            }
        </section>
    )
}

export default ProfilePage