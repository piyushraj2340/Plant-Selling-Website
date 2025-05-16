import React from "react";
import { Route, Routes, } from "react-router-dom";

// importing pages 
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductPage from "../pages/ProductPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import LogoutPage from "../pages/LogoutPage";
import ProfilePage from "../pages/ProfilePage";
import NurseryProfilePage from "../pages/NurseryProfilePage";
//TODO: ADD NURSERY PUBLIC PROFILE PAGE HERE
import CreateNurseryPage from "../pages/CreateNurseryPage";
import EditNurseryPage from "../pages/EditNurseryPage";
import AddNewPlants from "../pages/AddNewPlants";
import EditPlantsPage from "../pages/EditPlantsPage";
import AddressPage from "../pages/AddressPage";
import AddNewAddressPage from "../pages/AddNewAddressPage";
import EditAddressPage from "../pages/EditAddressPage";
import ContactUsPage from "../pages/ContactUsPage";
import CartPage from "../pages/CartPage";
import CheckoutShippingPage from "../pages/CheckoutShippingPage";
import CheckoutConfirmPage from "../pages/CheckoutConfirmPage";
import CheckoutPaymentPage from "../pages/CheckoutPaymentPage";

import PageNotFound from "../pages/Error404Page";

import NurseryPublicStorePage from "../pages/NurseryPublicStorePage";
import OrderHistoryPages from "../pages/OrderHistoryPages";
import SuccessPage from "../pages/SuccessPage";
import OrderDetailsPages from "../pages/OrderDetailsPages";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import UserVerificationEmailSent from "../pages/UserVerificationEmailSent";
import UserVerificationConfirmAccount from "../pages/UserVerificationConfirmAccount";
import ResetYourPasswordPage from "../pages/ResetYourPasswordPage";
import PasswordResetEmailSentPage from "../pages/PasswordResetEmailSentPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import FAQPage from "../pages/FAQPage";
import HelpPage from "../pages/HelpPage";
import ProfileSettings from "../features/user/Components/ProfileSettings";
import UserProfile from "../features/user/Components/UserProfile";
import TwoFactorAuthenticationPage from "../pages/TwoFactorAuthenticationPage";
import ProtectedRoute from "./ProtectedRoute";

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
            <Route exact path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route exact path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} >
                <Route index element={<UserProfile />} />
                <Route exact path="settings" element={<ProfileSettings />} />
            </Route>
            <Route exact path="/account/verificationEmail" element={<UserVerificationEmailSent />} />
            <Route exact path="/account/passwordResetEmail" element={<PasswordResetEmailSentPage />} />
            <Route exact path="/account/verificationConfirmation/:token" element={<UserVerificationConfirmAccount />} />
            <Route exact path="/account/ResetYourPassword/:token" element={<ResetYourPasswordPage />} />
            <Route exact path="/account/twoFactorAuthentication/:token" element={<TwoFactorAuthenticationPage />} />
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

            <Route exact path="/success" element={<SuccessPage />} />

            <Route path="/orders/history" element={<OrderHistoryPages />} />
            <Route path="/orders/details/:id" element={<OrderDetailsPages />} />

            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/FAQ" element={<FAQPage />} />
            <Route path="/help" element={<HelpPage />} />

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default React.memo(Routing);