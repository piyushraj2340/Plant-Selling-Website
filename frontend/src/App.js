import { Route, Routes } from "react-router-dom";
import React, { createContext, useReducer } from "react";

// styling  
import "./Asset/Style/Style.scss"

// Components 
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


import { initialState, reducer } from './reducer/Reducer';
import ChooseTemplate from "./Components/Shared/ChooseTemplate";
import Checkout from "./Components/Checkout";
import Shipping from "./Components/Shipping";
import Confirm from "./Components/Confirm";
import EditPlants from "./Components/EditPlants";
import { message } from "antd";




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
      <Route exact path="/nursery/add" element={<SetNursery />} />
      <Route exact path="/nursery/update/:id" element={<EditNursery />} />
      <Route exact path="/nursery/plant/add" element={<SetPlants />} />
      <Route exact path="/nursery/plant/update/:id" element={<EditPlants />} />
      <Route exact path="/address" element={<Address />} />
      <Route exact path="/address/add" element={<SetAddress />} />
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
  const [loginLogout, setLoginLogout] = useReducer(reducer, initialState);
  const [cartLength, setCartLength] = useReducer(reducer, initialState);

  // global configuration antd to alert the message to users
  message.config({
    top: 75,
    maxCount: 3,
    CSSProperties: {
        backgroundColor: "#000",
        color: "#fff"
    }
})

  return (
    <>
      <UserContext.Provider value={{ loginLogout, setLoginLogout, cartLength, setCartLength }}>
        <Navigation />
        <div style={{ marginTop: "70px" }}>
          <Routing />
        </div>
      </UserContext.Provider>
      <Footer />
    </>

  );
}

export default App;
