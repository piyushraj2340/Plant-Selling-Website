import React, { useState, useEffect } from 'react';
import { Tour } from 'antd';
import { useLocation } from 'react-router-dom';

import localStorageUtil from '../../utils/localStorage';

const AppTour = () => {
    const user = localStorageUtil.getData('user');
    const location = useLocation();

    // Safety check - only for guest accounts
    const isGuest = user && user.isGuestData;

    // Determine specific role
    let activeRole = null;
    if (isGuest && user.role) {
        if (user.role.includes('admin')) activeRole = 'admin';
        else if (user.role.includes('seller')) activeRole = 'nursery';
        else activeRole = 'user';
    }

    // Check localStorage for the specific role's tour flag
    const storageKey = `hasSeenGuestTour_${activeRole}`;
    const hasSeenTour = localStorage.getItem(storageKey);

    const shouldShowTour = isGuest && activeRole && !hasSeenTour;

    const [open, setOpen] = useState(false);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        if (shouldShowTour) {

            // Immediately mark it as seen so that if the page refreshes midway, it doesn't show again!
            localStorage.setItem(storageKey, 'true');

            let roleSteps = [];

            const isMobile = window.innerWidth <= 992; // Breakpoint for collapsed sidebars

            if (activeRole === 'admin') {
                if (isMobile) {
                    roleSteps = [
                        {
                            title: 'Welcome!',
                            description: 'Welcome to the Guest Admin Tour! You have complete administrative control over the platform.',
                            target: null,
                        },
                        { title: 'Admin Menu', description: 'Tap the hamburger menu icon (☰) to access Products, Orders, Reviews, and more.', target: () => document.querySelector('.navbar-toggler') || document.body }
                    ];
                } else {
                    roleSteps = [
                        {
                            title: 'Welcome!',
                            description: 'Welcome to the Guest Admin Tour! You have complete administrative control over the platform.',
                            target: null,
                        },
                        { title: 'Admin Dashboard', description: 'This is the main Admin Dashboard overview.', target: () => document.querySelector('a[href="/dashboard"]') },
                        { title: 'Manage Products', description: 'Manage all platform products and global inventory here.', target: () => document.querySelector('a[href="/dashboard/products"]') },
                        { title: 'Global Orders', description: 'Monitor all incoming global orders.', target: () => document.querySelector('a[href="/dashboard/orders"]') },
                        { title: 'User Reviews', description: 'Moderate and manage user reviews across the platform.', target: () => document.querySelector('a[href="/dashboard/review"]') },
                        { title: 'Income & Revenue', description: 'View detailed income and revenue analytics.', target: () => document.querySelector('a[href="/dashboard/income"]') },
                        { title: 'Coupons', description: 'Create and manage discount coupons.', target: () => document.querySelector('a[href="/dashboard/coupon"]') },
                        { title: 'Categories', description: 'Manage the product categories available on the store.', target: () => document.querySelector('a[href="/dashboard/categories"]') },
                        { title: 'Help Requests', description: 'View and respond to support tickets and help requests.', target: () => document.querySelector('a[href="/dashboard/help"]') },
                        { title: 'User Management', description: 'Manage, edit, or block users on the platform.', target: () => document.querySelector('a[href="/dashboard/users"]') }
                    ];
                }
            } else if (activeRole === 'nursery') {
                if (isMobile) {
                    roleSteps = [
                        {
                            title: 'Welcome!',
                            description: 'Welcome to the Guest Nursery Tour! Here you can manage your plant store and see incoming orders.',
                            target: null,
                        },
                        { title: 'Nursery Menu', description: 'Tap the menu icon to access your Dashboard, Plants, Orders, Active Chats, and Settings.', target: () => document.querySelector('.navbar-toggler') || document.body }
                    ];
                } else {
                    roleSteps = [
                        {
                            title: 'Welcome!',
                            description: 'Welcome to the Guest Nursery Tour! Here you can manage your plant store and see incoming orders.',
                            target: null,
                        },
                        { title: 'Nursery Dashboard', description: 'This is your main Seller Dashboard overview.', target: () => document.querySelector('[title="Manage Your Nursery"]') },
                        { title: 'Manage Plants', description: 'Add new plants, edit existing stock, and manage inventory.', target: () => document.querySelector('[title="Manage Your Plants"]') },
                        { title: 'Process Orders', description: 'Process and manage your incoming customer orders.', target: () => document.querySelector('[title="Manage Your Orders"]') },
                        { title: 'Help & Messages', description: 'Access seller help and support.', target: () => document.querySelector('[title="Help & Messages"]') },
                        { title: 'Active Chats', description: 'Chat directly with your customers.', target: () => document.querySelector('[title="Active Chats"]') },
                        { title: 'Settings', description: 'Customize your nursery storefront details and settings.', target: () => document.querySelector('[title="Settings"]') }
                    ];
                }
            } else {
                if (isMobile) {
                    roleSteps = [
                        {
                            title: 'Welcome!',
                            description: 'Welcome to the Guest User Tour! Explore our plant catalog and place demo orders.',
                            target: null,
                        },
                        { title: 'Profile Menu', description: 'Tap the menu to access your Order History, Addresses, and Messages.', target: () => document.querySelector('.navbar-toggler') || document.body }
                    ];
                } else {
                    roleSteps = [
                        {
                            title: 'Welcome!',
                            description: 'Welcome to the Guest User Tour! Explore our plant catalog and place demo orders.',
                            target: null,
                        },
                        { title: 'Order History', description: 'Track all your demo orders and view their history here.', target: () => document.querySelector('a[href="/orders/history"]') },
                        { title: 'Shipping Addresses', description: 'Manage your shipping addresses here.', target: () => document.querySelector('a[href="/address"]') },
                        { title: 'Direct Messages', description: 'View your direct messages with nurseries.', target: () => document.querySelector('a[href="/profile/messages"]') },
                        { title: 'Become a Seller', description: 'Want to sell plants? You can apply to become a seller here!', target: () => document.querySelector('a[href="/nursery/create"]') },
                        { title: 'Profile Settings', description: 'Manage your account settings and profile details.', target: () => document.querySelector('a[href="/profile/settings"]') }
                    ];
                }
            }

            if (activeRole === 'user') {
                roleSteps.push(
                    {
                        title: 'Plant Catalog',
                        description: 'Browse all of our available plants and products here.',
                        target: () => document.querySelector('a[href="/products"]'),
                    },
                    {
                        title: 'Search & Filters',
                        description: 'Looking for something specific? Use the search bar and category filters to find exactly what you need.',
                        target: () => document.querySelector('.input-group'),
                    },
                    {
                        title: 'Contact Us',
                        description: 'Have a question? Reach out to our support team anytime.',
                        target: () => document.querySelector('a[href="/contact-us"]'),
                    },
                    {
                        title: 'Your Profile',
                        description: 'Quickly access your user profile or login from here.',
                        target: () => document.querySelector('a[href="/profile"], a[href="/login"]'),
                    },
                    {
                        title: 'Shopping Cart',
                        description: 'Your Shopping Cart is here. Add products to your cart and checkout using fake demo credit cards.',
                        target: () => document.querySelector('a[href="/cart"]'),
                    }
                );
            }

            // Universal reminder for all guests
            roleSteps.push(
                {
                    title: 'Temporary Guest Session',
                    description: 'Important Reminder: This is a temporary guest account. Any data you create or modify will be automatically soft-deleted after 24 hours to keep the platform clean!',
                    target: null
                }
            );

            setSteps(roleSteps);

            // Small delay to let the DOM settle before running the tour
            setTimeout(() => {
                setOpen(true);
            }, 1000);
        }
    }, [shouldShowTour, activeRole, storageKey, location.pathname]); // Added location.pathname to re-check if route changed

    const handleClose = () => {
        setOpen(false);
    };

    if (!shouldShowTour && !open) return null;
    if (steps.length === 0) return null;

    return (
        <Tour
            open={open}
            onClose={handleClose}
            steps={steps}
            type="primary"
        />
    );
};

export default AppTour;
