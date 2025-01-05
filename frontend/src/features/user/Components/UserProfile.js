import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import ProfileAddress from './ProfileAddress';
import ProfileOrder from './ProfileOrder';

const UserProfile = () => {

    const items = [
        {
            path: './',
            title: 'Home',
        },
        {
            title: 'Profile'
        },
    ];


    function itemRender(currentRoute, params, items, paths) {
        const isLast = currentRoute?.path === items[items.length - 1]?.path;

        return isLast ? (
            <span>{currentRoute.title}</span>
        ) : (
            <Link to={`/${paths.join("/")}`}>{currentRoute.title}</Link>
        );
    }


    return (
        <>
            <div className='py-2 ms-2'>
                <Breadcrumb itemRender={itemRender} items={items} />
            </div>
            {/* <ProfileSettings /> */}

            <div className="card mb-2">
                <ProfileInfo />
            </div>
            <div className="row mb-2">
                <ProfileAddress />
            </div>
            <div className="row mb-2">
                <ProfileOrder />
            </div>
        </>
    )
}

export default UserProfile