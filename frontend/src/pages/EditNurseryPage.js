import React, { useEffect } from 'react'
import EditNursery from '../features/nursery/Components/NurseryForms/EditNursery'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EditNurseryPage = () => {
  document.title = "Update Your Nursery Data";

  const user = useSelector(state => state.user.user);
  const nursery = useSelector(state => state.nursery.nursery);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/nursery/update")
    } else {
      if (!user.role.includes("seller") && !nursery) {
        navigate("/profile")
      }
    }

  }, [user, nursery]);

  return (
    nursery && <EditNursery />
  )
}

export default EditNurseryPage