import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nurseryProfileAsync } from '../features/nursery/nurserySlice';
import { useNavigate } from 'react-router-dom';
import NurseryHeader from '../features/nursery/Components/NurseryHeader';
import NurseryBody from '../features/nursery/Components/NurseryBody';
import { message } from 'antd';

const NurseryProfilePage = () => {
  const nursery = useSelector(state => state.nursery.nursery);
  const error = useSelector(state => state.nursery.error);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  document.title = nursery && nursery.nurseryName || "Manage Your Nursery";


  useEffect(() => {
    !nursery && dispatch(nurseryProfileAsync())
  }, [dispatch])

  useEffect(() => {
    if (error) navigate('/profile');
    error && message.error(error.message);
  }, [dispatch, error]);



  return (
    <section style={{ backgroundColor: "#eee" }}>
      {
        nursery &&
        <div className="container py-3">
          <div className="row mb-2">
            <NurseryHeader />
          </div>
          <div className="row nursery-content-sticky">
            <NurseryBody />
          </div>
        </div>
      }
    </section>
  )
}

export default NurseryProfilePage