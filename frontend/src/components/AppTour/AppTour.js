import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const AppTour = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    // Only show tour to Guest users who haven't seen it yet
    const shouldShowTour = user && user.isGuestData && !localStorage.getItem('hasSeenGuestTour');

    const [run, setRun] = useState(false);
    
    // Steps for the tour
    const [steps, setSteps] = useState([
        {
            target: 'body',
            content: 'Welcome to the Guest Tour! Let us show you around the application. Note: All guest data is automatically reset every 24 hours.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '.navbar',
            content: 'This is the navigation bar. You can use it to browse products, access your profile, or view your cart.',
            placement: 'bottom',
        }
    ]);

    useEffect(() => {
        if (shouldShowTour) {
            
            // Add conditional steps based on user role
            let customSteps = [...steps];
            
            if (user.role.includes('admin')) {
                customSteps.push({
                    target: 'body',
                    content: 'As a Guest Admin, you have access to the Admin Dashboard. Try clicking on the Admin panel to see analytics, user management, and product management.',
                    placement: 'center'
                });
            } else if (user.role.includes('seller')) {
                customSteps.push({
                    target: 'body',
                    content: 'As a Guest Nursery, you can manage your store! You can add products, customize your store layout, and view your sales.',
                    placement: 'center'
                });
            } else {
                customSteps.push({
                    target: 'body',
                    content: 'As a standard Guest User, you can browse plants, add them to your cart, and place demo orders.',
                    placement: 'center'
                });
            }

            setSteps(customSteps);
            
            // Small delay to ensure DOM elements are loaded
            setTimeout(() => {
                setRun(true);
            }, 1000);
        }
    }, [shouldShowTour, user]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            // Tour is over, save flag to local storage so they don't see it again on refresh
            localStorage.setItem('hasSeenGuestTour', 'true');
            setRun(false);
        }
    };

    if (!shouldShowTour) return null;

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous={true}
            run={run}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            steps={steps}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#198754',
                },
            }}
        />
    );
};

export default AppTour;
