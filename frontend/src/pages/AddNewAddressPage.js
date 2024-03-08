import React, { useEffect } from 'react'
import AddAddress from '../features/address/Components/AddressForms/AddAddress';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddNewAddressPage = () => {
    document.title = "Add Your Address";

    const user = useSelector(state => state.user.user);
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