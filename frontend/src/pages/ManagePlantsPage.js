import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nurseryProfileAsync } from '../features/nursery/nurserySlice';
import { useNavigate } from 'react-router-dom';
import NurseryHeader from '../features/nursery/Components/NurseryHeader';
import NurserySideNav from '../features/nursery/Components/NurserySideNav';
import ManagePlantsTable from '../features/nursery/Components/ManagePlantsTable';
import { message } from 'antd';
import localStorageUtil from '../utils/localStorage';

const ManagePlantsPage = () => {
    const nursery = useSelector(state => state.nursery.nursery);
    const error = useSelector(state => state.nursery.error);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isCollapseSideNav, setIsCollapseSideNav] = useState(localStorageUtil.getData("isCollapseSideNav") ?? false);

    useEffect(() => {
        document.title = nursery ? `Manage Plants - ${nursery.nurseryName}` : "Manage Your Plants";
    }, [nursery]);

    useEffect(() => {
        !nursery && dispatch(nurseryProfileAsync());
    }, [dispatch, nursery]);

    useEffect(() => {
        if (error) {
            message.error(error.message);
            navigate('/profile');
        }
    }, [dispatch, error, navigate]);

    return (
        <section style={{ backgroundColor: "#eee" }}>
            {nursery && (
                <div className="container py-3">
                    <div className="row mb-2">
                        <NurseryHeader />
                    </div>
                    <div className="row nursery-content-sticky">
                        <NurserySideNav isCollapseSideNav={isCollapseSideNav} setIsCollapseSideNav={setIsCollapseSideNav} />
                        <div className='nursery-main-content' style={isCollapseSideNav ? { width: 'calc(100% - 58px)' } : { width: '75%' }}>
                            <div className='p-2 p-md-3 p-lg-4 border rounded bg-light'>
                                <div className="main-content mb-4">
                                    <ManagePlantsTable />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ManagePlantsPage;
