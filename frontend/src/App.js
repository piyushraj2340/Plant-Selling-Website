// importing from library
import { Route, Routes, } from "react-router-dom";
import React, { createContext, useEffect } from "react";
import { message } from "antd";

// importing form styling[sass]  
import "./Asset/Style/Style.scss"

// importing pages 
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/LogoutPage";
import ProfilePage from "./pages/ProfilePage";
import NurseryProfilePage from "./pages/NurseryProfilePage";
//TODO: ADD NURSERY PUBLIC PROFILE PAGE HERE
import CreateNurseryPage from "./pages/CreateNurseryPage";
import EditNurseryPage from "./pages/EditNurseryPage";
import AddNewPlants from "./pages/AddNewPlants";
import EditPlantsPage from "./pages/EditPlantsPage";
import AddressPage from "./pages/AddressPage";
import AddNewAddressPage from "./pages/AddNewAddressPage";
import EditAddressPage from "./pages/EditAddressPage";
import ContactUsPage from "./pages/ContactUsPage";
import CartPage from "./pages/CartPage";
import CheckoutShippingPage from "./pages/CheckoutShippingPage";
import CheckoutConfirmPage from "./pages/CheckoutConfirmPage";
import CheckoutPaymentPage from "./pages/CheckoutPaymentPage";

import PageNotFound from "./pages/Error404Page";

import Navigation from "./features/common/Navigation";
import Success from "./features/common/Success";
import Footer from "./features/common/Footer";
import ScrollToTop from "./features/common/ScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { userAuthCheckAsync } from "./features/auth/authSlice";
import { userProfileAsync } from "./features/user/userSlice";
import { nurseryProfileAsync } from "./features/nursery/nurserySlice";
import { cartDataFetchAsync } from "./features/cart/cartSlice";
import NurseryPublicStorePage from "./pages/NurseryPublicStorePage";



export const UserContext = createContext(); // TODO: REMOVE AFTER REFACTOR ALL THE CODE.


const Routing = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/home" element={<HomePage />} />
      <Route exact path="/products" element={<ProductsPage />} />
      <Route exact path="/product/:id" element={<ProductPage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/signup" element={<SignupPage />} />
      <Route exact path="/logout" element={<LogoutPage />} />
      <Route exact path="/profile" element={<ProfilePage />} />
      <Route exact path="/nursery" element={<NurseryProfilePage />} />
      <Route exact path="/nursery/store/view/:id" element={<NurseryPublicStorePage />} /> {/* //TODO: NEED TO IMPLEMENTS THIS */}
      <Route exact path="/nursery/create" element={<CreateNurseryPage />} />
      <Route exact path="/nursery/update" element={<EditNurseryPage />} />
      <Route exact path="/nursery/plant/new" element={<AddNewPlants />} />
      <Route exact path="/nursery/plant/update/:id" element={<EditPlantsPage />} /> {/* //TODO: NEED TO IMPLEMENTS THIS */}
      <Route exact path="/address" element={<AddressPage />} />
      <Route exact path="/address/new" element={<AddNewAddressPage />} />
      <Route exact path="/address/update/:id" element={<EditAddressPage />} />
      <Route exact path="/contact-us" element={<ContactUsPage />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/checkout/shipping" element={<CheckoutShippingPage />} />
      <Route path="/checkout/confirm" element={<CheckoutConfirmPage />} />
      <Route path="/checkout/payment" element={<CheckoutPaymentPage />} />

      <Route exact path="/success" element={<Success />} /> {/*create a dynamic store page*/}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

function App() {
  const user = useSelector(state => state.user.user);
  const userAuthCheck = useSelector(state => state.auth.userAuthCheck);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userAuthCheckAsync());
  }, [dispatch]);

  useEffect(() => {
    if (userAuthCheck) {
      dispatch(userProfileAsync());
    }
  }, [dispatch, userAuthCheck]);

  useEffect(() => {
    if (user && user.role.includes("seller")) {
      dispatch(nurseryProfileAsync());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch(cartDataFetchAsync());
    }
  }, [dispatch, user])

  // global configuration antd to alert the message to users
  message.config({
    top: 75,
    maxCount: 3,
    CSSProperties: {
      backgroundColor: "#000",
      color: "#fff"
    }
  });

  return (
    <>
      <Navigation />
      <ScrollToTop />
      <div style={{ marginTop: "70px" }}>
        <Routing />
      </div>
      <Footer />
    </>

  );
}

export default App;
