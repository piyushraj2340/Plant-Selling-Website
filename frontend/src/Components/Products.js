import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { Rating } from 'react-simple-star-rating'
import noPlantsImage from '../Asset/img/noDataFound.jpg';
import { Link } from 'react-router-dom'
import handelDataFetch from '../utils/handelDataFetch';


const Products = () => {
    document.title = "Plant Selling Website";
    
    const { setShowAnimation } = useContext(UserContext);

    const [products, setProducts] = useState([]);

    const getProductsData = async () => {
        try {
            const result = await handelDataFetch({ path: '/api/v2/products/plants', method: "GET" }, setShowAnimation);

            if (result.status) {
                setProducts(result.result);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error(error);
        }

    }

    const getProductsDataByCategory = async (category) => {
        try {
            const result = await handelDataFetch({ path: `/api/v2/products/plantsByCategory/${category}`, method: "GET" }, setShowAnimation);

            if (result.status) {
                setProducts(result.result);
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        getProductsData();
    }, []);



    return (
        <div className="container product-container mb-4 mb-md-5">
            <div className="p-2">
                <h1 className='text-center p-2'>Available Plants for Sell</h1>
            </div>
            <div className="p-2 d-flex flex-wrap justify-content-center align-item-center">
                <button onClick={getProductsData} className="btn btn-secondary m-1">All</button>

                <button onClick={() => getProductsDataByCategory("flowering-plants")} className="btn btn-secondary m-1">Flowering Plants</button>
                <button onClick={() => getProductsDataByCategory("medicinal-plants")} className="btn btn-secondary m-1">Medicinal Plants</button>
                <button onClick={() => getProductsDataByCategory("ornamental-plants")} className="btn btn-secondary m-1">Ornamental Plants</button>
                <button onClick={() => getProductsDataByCategory("indoor-plants")} className="btn btn-secondary m-1">Indoor Plants</button>
            </div>
            <div className="product-content px-2">
                {
                    products &&

                    products.map((elem) => {
                        return (
                            <div key={elem.id} className="px-1 d-flex center-text overflow-hidden">
                                <Link className='text-dark' style={{ textDecoration: "none" }} to={`/product/${elem._id}`}>
                                    <div className="card my-1">
                                        <img className="img-fluid" src={elem.images[0].url} alt="Card plants" />
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
            <div className="w-100">
                {
                    products.length === 0 &&

                    <div className="d-flex justify-content-center">
                        <div className=''>
                            <div className="row">
                                <div className="img d-flex justify-content-center">
                                    <img src={noPlantsImage} style={{ maxHeight: "60vh" }} alt="no plants data found" className='img-fluid' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex d-flex flex-column align-items-center">
                                    <h3 className="h3" style={{ fontFamily: "cursive" }}>No Product Found</h3>
                                    <Link onClick={() => window.location.reload()}><i className="fa fa-refresh"></i> Refresh Your Page</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Products