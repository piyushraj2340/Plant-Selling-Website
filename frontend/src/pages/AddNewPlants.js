import React, { useEffect } from 'react'
import AddPlants from '../features/nursery/Components/PlantsForms/AddPlants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useUserData from '../hooks/useUserData';

const AddNewPlants = () => {
    document.title = "Add Plant to Nursery";

    const nursery = useSelector(state => state.nursery.nursery);
    const {userData:user} = useUserData();
    
    const navigate = useNavigate();

    useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/nursery/plant/new")
    } else {
      if (!user.role.includes("seller") && !nursery) {
        navigate("/profile")
      }
    }

  }, [user, nursery]);

    return (
        nursery && <AddPlants />
    )
}

export default AddNewPlants