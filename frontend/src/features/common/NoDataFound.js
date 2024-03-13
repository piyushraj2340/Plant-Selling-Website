import React from 'react'
import { Link } from 'react-router-dom';

const NoDataFound = ({link, message}) => {

    const noPlantsImage = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/no-data-found";

    return (
        <div className="container mb-4 mb-md-5">
            <div className="row">
                <div className="d-flex justify-content-center">
                    <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                </div>
            </div>
            <div className="row">
                <div className="d-flex d-flex flex-column align-items-center">
                    <h3 className="h3" style={{ fontFamily: "cursive" }}>No Product Found</h3>
                    <Link to={link} className='btn'><i className="fas fa-arrow-left"></i> {message}</Link>
                </div>
            </div>
        </div>
    )
}

export default NoDataFound