
const { validateStrongPassword } = require('../../../utils/validateStrongPassword');

module.exports = async (req, res, next) => {
    try {
        //* Getting user from the request object (assuming authentication middleware adds user info to `req.user`)
        const userId = req.user;

        //! User ID does not exist
        if (!userId) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }

        //* Extracting passwords from the request body
        let { previousPassword, password, confirmPassword } = req.body;

        previousPassword = previousPassword?.toString().trim();
        password = password?.toString().trim();
        confirmPassword = confirmPassword?.toString().trim();

        //! Check if all parameters are provided
        if (!previousPassword || !password || !confirmPassword) {
            const error = new Error("All password fields are required (previousPassword, password, confirmPassword)");
            error.statusCode = 400;
            throw error;
        }

        //! Check if new password and confirm password match
        if (password !== confirmPassword) {
            const error = new Error("New password and confirm password do not match");
            error.statusCode = 400;
            throw error;
        }

        if (previousPassword === password) {
            const error = new Error("New password cannot be the same as the previous password");
            error.statusCode = 400;
            throw error;
        }

        //! Check if the new password is strong
        if (!validateStrongPassword(password)) {
            const error = new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            error.statusCode = 400;
            throw error;
        }


        req.body = { previousPassword, password, confirmPassword };
        next();

    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
};