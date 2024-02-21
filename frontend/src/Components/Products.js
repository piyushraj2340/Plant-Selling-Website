import React from 'react'
import { Rating } from 'react-simple-star-rating'
import { useState, useEffect } from 'react';



import { Link } from 'react-router-dom'
import Animation from './Shared/Animation'; // animation should be at working in the last
import handelDataFetch from '../Controller/handelDataFetch';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [showAnimation, setShowAnimation] = useState(false);


    const getProductsData = async () => {
        try {
            const result = await handelDataFetch({path: '/api/v2/products/plants', method: "GET"}, setShowAnimation);

            if (result.status) {
                setProducts(result.result);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const getProductsDataByCategory = async (category) => {
        try {
            const result = await handelDataFetch({path: `/api/v2/products/plantsByCategory/${category}`, method: "GET"}, setShowAnimation);

            if (result.status) {
                setProducts(result.result);
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getProductsData();
    }, []);



    return (
        <>
            <div className="container">
                <div className="row">
                    <h1 className='text-center p-2'>Available Plants for Sell</h1>
                </div>
                <div className="row m-1 d-flex justify-content-center">
                    <div className="col-sm-12 d-flex justify-content-center rounded py-2 bg-light">
                        <button onClick={getProductsData} className="btn btn-secondary mx-2">All</button>
                        <button onClick={() => getProductsDataByCategory("flowering-plants")} className="btn btn-secondary mx-2">Flowering Plants</button>
                        <button onClick={() => getProductsDataByCategory("medicinal-plants")} className="btn btn-secondary mx-2">Medicinal Plants</button>
                        <button onClick={() => getProductsDataByCategory("ornamental-plants")} className="btn btn-secondary mx-2">Ornamental Plants</button>
                        <button onClick={() => getProductsDataByCategory("indoor-plants")} className="btn btn-secondary mx-2">Indoor Plants</button>
                    </div>
                </div>
                <div className="row">
                    {
                        products &&

                        products.map((elem) => {
                            return (
                                <div key={elem.id} className="col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center center-text">
                                    <Link className='text-dark' style={{ textDecoration: "none" }} to={`/product/${elem._id}`}>
                                        <div className="card m-2" style={{ width: "300px" }}>
                                            <img className="card-img-top" src={elem.images[0].url} alt="Card plants" style={{ width: "100%", height: "253px", aspectRatio: "4/3", objectFit: "contain" }} />
                                            <div className="card-body">
                                                <h4 className="card-title">{elem.plantName}</h4>
                                                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>price</p>
                                                <p className="card-text">₹ {Math.round(elem.price - elem.discount / 100 * elem.price)}</p>
                                                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>category</p>
                                                <p className="card-text">{elem.category}</p>
                                                <p className="text-muted" style={{ fontSize: "14px", margin: "0" }}>ratings</p>
                                                <p className="card-text"><Rating initialValue={3 + Math.random() * 2} readonly={true} size={20} allowFraction="true" /> <small style={{ position: "relative", top: "4px" }}>{elem.noOfRatings}</small></p>

                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                showAnimation && <Animation />
            }
        </>
    )
}

export default Products