import React from 'react'
import error404 from '../Asset/img/404.jpg'

const Error404 = () => {
  document.title = "Page Not Found"
  return (
    <div className='d-flex justify-content-center align-item-center' style={{height: "50vh"}}>
      <img src={error404} alt="Page not found" className='img-fluid' />
    </div>
  )
}

export default Error404