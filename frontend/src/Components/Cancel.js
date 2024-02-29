import React from 'react'

const Cancel = () => {
  document.title = "Payment Failed"

  return (
    <div className='bg-dark row d-flex justify-content-center align-content-center m-0' style={{ width: "100%", minHeight: "100vh", position: "fixed", top: "0", left: "0", zIndex: 1 }}>
      <div className="alert alert-success col-md-4" style={{ height: "100%" }}>
        <strong>❌ Order Cancel!</strong> Something Went Wrong.
      </div>
    </div>
  )
}

export default Cancel