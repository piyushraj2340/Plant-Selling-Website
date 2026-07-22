const isAdmin = (req, res, next) => {
    try {
        if (req.role && req.role.includes("admin")) {
            next();
        } else {
            const error = new Error("Access denied. Admin privileges required.");
            error.statusCode = 403;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

module.exports = isAdmin;
