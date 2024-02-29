// importing from library
import { Route, Routes, } from "react-router-dom";
import React, { createContext, useEffect, useReducer } from "react";
import { message } from "antd";

// importing form styling[sass]  
import "./Asset/Style/Style.scss"

// importing Components 
import Home from "./Components/Home";
import Navigation from "./Components/Navigation";
import Products from "./Components/Products";
import Product from "./Components/Product";
import PageNotFound from "./Components/Error404";
import Success from "./Components/Success";
import Cancel from "./Components/Cancel";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Logout from "./Components/Logout";
import Profile from "./Components/Profile";
import NurseryProfile from "./Components/NurseryProfile";
import NurseryStoreView from "./Components/NurseryStoreView";
import SetNursery from "./Components/SetNursery";
import EditNursery from "./Components/EditNursery";
import SetPlants from "./Components/SetPlants";
import Cart from "./Components/Cart";
import Animation from "./Components/Shared/Animation";
import ContactUs from "./Components/ContactUs";
import SetAddress from "./Components/SetAddress";
import Address from "./Components/Address";
import EditAddress from "./Components/EditAddress";
import ChooseTemplate from "./Components/Shared/ChooseTemplate";
import EditPlants from "./Components/EditPlants";
import Shipping from "./Components/Shipping";
import Confirm from "./Components/Confirm";
import Checkout from "./Components/Checkout";
import ScrollToTop from "./Components/ScrollToTop";

// importing form the reducer 
import { initialState, reducer } from './reducer/Reducer';

// importing form utils 
import handelDataFetch from "./utils/handelDataFetch";

export const UserContext = createContext();

const Routing = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/home" element={<Home />} />
      <Route exact path="/products" element={<Products />} />
      <Route exact path="/product/:id" element={<Product />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/logout" element={<Logout />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/nursery" element={<NurseryProfile />} />
      <Route exact path="/nursery/store/view/:id" element={<NurseryStoreView />} />
      <Route exact path="/nursery/create" element={<SetNursery />} />
      <Route exact path="/nursery/update/:id" element={<EditNursery />} />
      <Route exact path="/nursery/plant/new" element={<SetPlants />} />
      <Route exact path="/nursery/plant/update/:id" element={<EditPlants />} />
      <Route exact path="/address" element={<Address />} />
      <Route exact path="/address/new" element={<SetAddress />} />
      <Route exact path="/address/update/:id" element={<EditAddress />} />
      <Route exact path="/contact-us" element={<ContactUs />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout/shipping" element={<Shipping />} />
      <Route path="/checkout/confirm" element={<Confirm />} />
      <Route path="/checkout/payment" element={<Checkout />} />

      <Route exact path="/choose/template" element={<ChooseTemplate />} /> {/* Choose template view for testing */}
      <Route exact path="/success" element={<Success />} /> {/*create a dynamic store page*/}
      <Route exact path="/cancel" element={<Cancel />} /> {/*create a dynamic store page*/}
      <Route exact path="/ani" element={<Animation />} /> {/*need to remove this route*/}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useReducer(reducer, initialState);
  const [cartLength, setCartLength] = useReducer(reducer, initialState);
  const [showAnimation, setShowAnimation] = useReducer(reducer, initialState);

  // global configuration antd to alert the message to users
  message.config({
    top: 75,
    maxCount: 3,
    CSSProperties: {
      backgroundColor: "#000",
      color: "#fff"
    }
  })

  const handleGetAddedCart = async () => {
    try {
      const result = await handelDataFetch({ path: '/api/v2/checkout/carts', method: "GET" }, setShowAnimation);

      if (result.status) {
        setCartLength({ type: "CART", length: result.result.length });
      } else {
        setCartLength({ type: "CART", length: null });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetUserData = async () => {
    try {
      const result = await handelDataFetch({ path: '/api/v2/user/profile', method: 'GET' }, setShowAnimation);

      if (result.status) {
        handleGetAddedCart();
        setUser({ type: "USER", user: result.result });
      } else {
        setUser({ type: "USER", user: null });
        setCartLength({ type: "CART", length: null });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    handleGetUserData();
  }, []);

  return (
    <>
      <UserContext.Provider value={{ user, setUser, cartLength, setCartLength, setShowAnimation }}>
        <Navigation />
        <ScrollToTop />
        <div style={{ marginTop: "70px" }}>
          <Routing />
        </div>
        {
          showAnimation && <Animation />
        }
      </UserContext.Provider>
      <Footer />
    </>

  );
}

export default App;
