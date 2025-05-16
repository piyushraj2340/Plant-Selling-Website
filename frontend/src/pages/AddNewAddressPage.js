import React, { useEffect } from 'react'
import AddAddress from '../features/address/Components/AddressForms/AddAddress';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useUserData from '../hooks/useUserData';

const AddNewAddressPage = () => {
    document.title = "Add Your Address";

    const {userData:user} = useUserData();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login?redirect=/address/new");
        }
    }, [])

    return (
        user && <AddAddress />
    )
}

export default AddNewAddressPage