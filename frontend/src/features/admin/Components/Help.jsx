import React, { useState } from 'react'
import HelpTables from './HelpTables'
import { Modal } from 'antd'


const Help = () => {

  const [openModalCreateIssue, setOpenModalCreateIssue] = useState(false);

  const init = {
    title: "",
    category: '',
    description: '',
    createdAd: '',
  }

  const [createIssue, setCreateIssue] = useState(init);


  const handelCreateNewIssueModelSave = () => {

  }

  const handelCreateNewIssueClose = () => {
    setOpenModalCreateIssue(false);
  }

  const handelOpenCreateNewIssueModel = () => {
    setOpenModalCreateIssue(true);
  }

  return (
    <div className="row g-2 my-2 bg-white border rounded">
      <div className="header d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start p-2 ps-md-4 w-100">
        <div className="head">
          <h5 className='h5 fw-bolder'>Helps And Contact Us.</h5>
        </div>
        <div className="tools me-2">
          <button className="btn btn-success" onClick={handelOpenCreateNewIssueModel}> Raise a Issue</button>
        </div>
      </div>
      <HelpTables />

      <Modal title="Create New Issue" open={openModalCreateIssue} onCancel={handelCreateNewIssueClose} onOk={handelCreateNewIssueModelSave} okText="Submit" >
        <div className="row border py-3 rounded">
          <div className="mb-1">
            <div className="form-floating mb-1">
              <input type="text" className="form-control" id="title" name='title' placeholder="Enter Issue Title" />
              <label for="title">Title of Issue <small className='text-danger'>*</small></label>
            </div>
            <div className="ps-2 small text-secondary">
              <p className="small"> <i className="fas fa-info-circle"></i> Create issue subject.</p>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-floating mb-1">
              <select type="text" className="form-control" id="category" defaultValue={'none'} name='category' >
                <option value="none" disabled>--Select the category--</option>
                <option value="product">Products</option>
                <option value="orders">Orders</option>
                <option value="review">Customer Reviews</option>
                <option value="income">Income</option>
                <option value="coupon">Discount Coupon</option>
                <option value="other">Other</option>
              </select>
              <label for="category">Issue category <small className='text-danger'>*</small></label>
            </div>
            <div className="small ms-2 text-secondary">
              <p className='small'> <i className="fas fa-info-circle"></i> Select the category for creating the issue.</p>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-floating mb-1">
              <textarea className="form-control" id="description" name='description' placeholder="Enter Description"></textarea>
              <label for="description">Description <small className='text-danger'>*</small></label>
            </div>
            <div className="small ms-2 text-secondary">
              <p className='small'> <i className="fas fa-info-circle"></i> Enter the details about the your issue.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Help