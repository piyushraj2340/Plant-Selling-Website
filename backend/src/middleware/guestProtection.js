const userModel = require('../model/userModel/user');
const nurseryModel = require('../model/nurseryModel/nursery');

// Environment variables for guest emails, with fallbacks
const GUEST_USER_EMAIL = process.env.GUEST_USER_EMAIL || 'guest-user@plantseller.com';
const GUEST_NURSERY_EMAIL = process.env.GUEST_NURSERY_EMAIL || 'guest-seller@plantseller.com';
const GUEST_ADMIN_EMAIL = process.env.GUEST_ADMIN_EMAIL || 'guest-admin@plantseller.com';

const guestEmails = [GUEST_USER_EMAIL, GUEST_NURSERY_EMAIL, GUEST_ADMIN_EMAIL];

/**
 * Middleware to protect real user data from being modified by Guest accounts.
 * This should be applied AFTER the `auth` middleware.
 */
const guestProtection = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(); // Pass if not authenticated
        }

        // Check if the current user is a guest user
        const user = await userModel.findById(req.user).select('email isGuestData');
        
        if (!user) {
            return next();
        }

        const isGuestUser = user.isGuestData || guestEmails.includes(user.email);

        // If not a guest user, they can do anything they have permission to do
        if (!isGuestUser) {
            return next();
        }

        // If the request is a non-mutating request (GET), allow it.
        if (req.method === 'GET' || req.method === 'POST') {
            return next();
        }

        // For PUT, PATCH, DELETE, we must verify the target entity isGuestData.
        const pathSegments = req.originalUrl.split('?')[0].split('/').filter(Boolean);
        // typical path: api/v2/admin/users/12345 or api/v2/nursery/plants/12345
        let resourceType = '';
        let resourceId = req.params.id || req.body._id || req.body.id;

        if (pathSegments.includes('users')) resourceType = 'user';
        else if (pathSegments.includes('plants')) resourceType = 'plant';
        else if (pathSegments.includes('nurseries')) resourceType = 'nursery';
        else if (pathSegments.includes('orders')) resourceType = 'order';
        else if (pathSegments.includes('categories')) resourceType = 'category';
        else if (pathSegments.includes('coupons')) resourceType = 'coupon';

        if (resourceType && resourceId) {
            let model;
            if (resourceType === 'user') model = require('../model/userModel/user');
            if (resourceType === 'plant') model = require('../model/nurseryModel/plants');
            if (resourceType === 'nursery') model = require('../model/nurseryModel/nursery');
            if (resourceType === 'order') model = require('../model/checkoutModel/orders');
            if (resourceType === 'category') model = require('../model/category');
            if (resourceType === 'coupon') model = require('../model/nurseryModel/coupon');

            if (model) {
                const doc = await model.findById(resourceId).select('isGuestData isSeedData');
                if (doc) {
                    if (doc.isGuestData !== true) {
                        const error = new Error("Guest accounts are not allowed to modify or delete real user data.");
                        error.statusCode = 403;
                        return next(error);
                    }
                    if (doc.isSeedData === true) {
                        const error = new Error("This is a core demonstration item and cannot be modified or deleted. Feel free to create new items to test these features!");
                        error.statusCode = 403;
                        return next(error);
                    }
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    guestProtection,
    GUEST_USER_EMAIL,
    GUEST_NURSERY_EMAIL,
    GUEST_ADMIN_EMAIL
};
