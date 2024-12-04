import React, { useEffect } from 'react';
import { Rating } from 'react-simple-star-rating'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsAsync, getProductsByCategoryAsync } from '../../../products/productsSlice';
import NoDataFound from '../../../common/NoDataFound';
// import Animation from '../../common/Animation';


const NurseryStoreAllProducts = ({nurseryPublicStore}) => {
    document.title = nurseryPublicStore.nurseryName + " - Products";

    const products = useSelector((state) => state.products.products);
    const dispatch = useDispatch();

    useEffect(() => {
        products && !products.length && dispatch(getAllProductsAsync());
    }, [products]);

    const nurseryProduct = products.filter(p => p.nursery._id === nurseryPublicStore._id);

    return (
        <div className="container product-container mb-4 mb-md-5">
            <div className="p-2">
                <h1 className='text-center p-2'>Welcome to the {nurseryPublicStore.nurseryName}</h1>
            </div>
            <div className="p-2 d-flex flex-wrap justify-content-center align-item-center">
                <button onClick={() => dispatch(getAllProductsAsync())} className="btn btn-secondary m-1">All</button>
                <button onClick={() => dispatch(getProductsByCategoryAsync("flowering-plants"))} className="btn btn-secondary m-1">Flowering Plants</button>
                <button onClick={() => dispatch(getProductsByCategoryAsync("medicinal-plants"))} className="btn btn-secondary m-1">Medicinal Plants</button>
                <button onClick={() => dispatch(getProductsByCategoryAsync("ornamental-plants"))} className="btn btn-secondary m-1">Ornamental Plants</button>
                <button onClick={() => dispatch(getProductsByCategoryAsync("indoor-plants"))} className="btn btn-secondary m-1">Indoor Plants</button>
            </div>
            <div className="product-content px-2">
                {
                    nurseryProduct &&

                    nurseryProduct.map((elem) => {
                        
                        return (
                            <div key={elem._id} className="px-1 d-flex center-text overflow-hidden">
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
                    nurseryProduct.length === 0 && <NoDataFound link="/products" message="No Data Found on Nursery Page" />
                }
            </div>
        </div>
    )
}

export default NurseryStoreAllProducts