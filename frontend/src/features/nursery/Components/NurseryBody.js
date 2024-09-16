import React, { useState } from 'react'
import NurserySideNav from './NurserySideNav';
import NurseryMain from './NurseryMain';
import localStorageUtil from '../../../utils/localStorage';

const NurseryBody = () => {
    const [isCollapseSideNav, setIsCollapseSideNav] = useState(localStorageUtil.getData("isCollapseSideNav") ?? false);

    return (
        <>
            <NurserySideNav isCollapseSideNav={isCollapseSideNav} setIsCollapseSideNav={setIsCollapseSideNav} />
            <NurseryMain isCollapseSideNav={isCollapseSideNav} />
        </>
    )
}

export default NurseryBody