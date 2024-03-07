import React, { useEffect } from 'react'
import SetNursery from '../features/nursery/Components/NurseryForms/SetNursery'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateNurseryPage = () => {
    document.title = "Create Your Nursery";

    const user = useSelector(state => state.user.user);
    const nursery = useSelector(state => state.nursery.nursery);

    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/login?redirect=/nursery/create")
        } else {
            if(user.role.includes("seller") || nursery) {
                navigate("/nursery")
            }
        }
        
    }, [user, nursery]);


    return (
        user && <SetNursery />
    )
}

export default CreateNurseryPage