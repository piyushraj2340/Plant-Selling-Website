const mongoose = require('mongoose');

const getQueryOptions = (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    // Ant Design table sorting gives fields like 'createdAt' and order like 'ascend' or 'descend'
    const sortField = req.query.sortField || 'createdAt';
    let sortOrder = -1; // Default descending
    if (req.query.sortOrder === 'ascend' || req.query.sortOrder === 'asc' || req.query.sortOrder === '1') {
        sortOrder = 1;
    }

    return { page, limit, skip, search, sort: { [sortField]: sortOrder } };
};

// Helper for generating search regex for specific fields
const buildSearchQuery = (search, fields) => {
    if (!search) return {};
    
    const searchRegex = new RegExp(search, 'i');
    const $or = [];
    
    fields.forEach(field => {
        $or.push({ [field]: searchRegex });
    });
    
    return { $or };
};

module.exports = {
    getQueryOptions,
    buildSearchQuery
};
