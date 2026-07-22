import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductAsync, fetchProductCouponsAsync } from '../features/products/productsSlice';
import ProductImages from '../features/products/Components/ProductImages';
import ProductInfo from '../features/products/Components/ProductInfo';
import ProductSummary from '../features/products/Components/ProductSummary';
import ProductReviews from '../features/products/Components/ProductReviews';
import NoDataFound from '../features/common/NoDataFound';
import Animation from '../features/common/Animation';

const ProductPage = () => {
  const product = useSelector(state => state.products.product);
  const isLoading = useSelector(state => state.products.isLoading);
  const dispatch = useDispatch();

  document.title = product ? product.plantName : "Plant info";

  const params = useParams();
  const _id = params.id;

  useEffect(() => {
    dispatch(getProductAsync(_id));
    dispatch(fetchProductCouponsAsync(_id));
  }, []);

  return (
    <>
      {
        product ?
          <div className='container mt-3 p-2 bg-light'>
            <div className="row">
              <ProductImages />
              <ProductInfo />
              <ProductSummary />
            </div>
            <div className='row mt-4 mb-4 px-3'>
              <div className="col-12">
                <h5 className="text-muted border-bottom pb-2 mb-3" style={{ fontSize: "16px", fontWeight: "600" }}>Description</h5>
                <div className="card-text text-secondary" style={{ lineHeight: "1.8", fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: product.description }}></div>
              </div>
            </div>
            <div className="row">
              <ProductReviews plantId={_id} />
            </div>
          </div>
          :
          <NoDataFound link="/products" message="Back To Products" />
      }
      {
        isLoading && <Animation />
      }
    </>
  )
}

export default ProductPage