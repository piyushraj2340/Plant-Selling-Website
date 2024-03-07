import React from 'react'

const Error404 = () => {
  document.title = "Page Not Found"
  const error404 = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/404";
  return (
    <section className='bg-section p-3 p-md-5'>
      <div className='d-flex justify-content-center align-item-center' style={{ height: "50vh" }}>
        <img src={error404} alt="Page not found" className='img-fluid' />
      </div>
      <h1 className='text-center py-1 py-md-2' style={{fontFamily: "cursive"}}>Page Not Found!</h1>
    </section>

  )
}

export default Error404