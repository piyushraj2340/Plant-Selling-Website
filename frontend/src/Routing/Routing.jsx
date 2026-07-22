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
import ManagePlantsPage from "../pages/ManagePlantsPage";
import CreateNurseryPage from "../pages/CreateNurseryPage";
import EditNurseryPage from "../pages/EditNurseryPage";
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
import MainLayout from "../features/common/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "../features/admin/AdminLayout";
import AdminDashboard from "../features/admin/Components/Dashboard";
import AdminProducts from "../features/admin/Components/Products";
import AdminOrders from "../features/admin/Components/Orders";
import AdminIncome from "../features/admin/Components/Income";
import AdminReviews from "../features/admin/Components/Reviews";
import AdminCoupon from "../features/admin/Components/Coupon";
import AdminCategories from "../features/admin/Components/Categories";
import AdminHelp from "../features/admin/Components/Help";
import AdminUsers from "../features/admin/Components/Users";

const Routing = () => {
    return (
        <Routes>
            {/* Main Application Routes (Includes Navigation & Footer) */}
            <Route element={<MainLayout />}>
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
                <Route exact path="/nursery/plants" element={<ManagePlantsPage />} />
                <Route exact path="/nursery/store/view/:id" element={<NurseryPublicStorePage />} /> {/* //TODO: NEED TO IMPLEMENTS THIS */}
                <Route exact path="/nursery/create" element={<CreateNurseryPage />} />
                <Route exact path="/nursery/update" element={<EditNurseryPage />} />
                <Route exact path="/address" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
                <Route exact path="/address/add" element={<ProtectedRoute><AddNewAddressPage /></ProtectedRoute>} />
                <Route exact path="/address/update/:id" element={<ProtectedRoute><EditAddressPage /></ProtectedRoute>} />
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
            </Route>

            {/* Admin Routes (Isolated Layout) */}
            <Route path="/dashboard" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="review" element={<AdminReviews />} />
                <Route path="income" element={<AdminIncome />} />
                <Route path="coupon" element={<AdminCoupon />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="help" element={<AdminHelp />} />
                <Route path="users" element={<AdminUsers />} />
            </Route>
        </Routes>
    );
}

export default React.memo(Routing);