import React, { useState } from 'react'
import NurserySideNav from './NurserySideNav';
import NurseryMain from './NurseryMain';

const NurseryBody = () => {
    const [isCollapseSideNav, setIsCollapseSideNav] = useState(false);

    return (
        <>
            <NurserySideNav isCollapseSideNav={isCollapseSideNav} setIsCollapseSideNav={setIsCollapseSideNav} />
            <NurseryMain isCollapseSideNav={isCollapseSideNav} />
        </>
    )
}

export default NurseryBody