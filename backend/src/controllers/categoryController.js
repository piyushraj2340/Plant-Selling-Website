const Category = require('../model/category');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().populate('parentCategory', 'name slug').sort({ name: 1 });
        res.status(200).json({ status: true, data: categories });
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).populate('parentCategory', 'name slug');
        if (!category) {
            return res.status(404).json({ status: false, message: 'Category not found' });
        }
        res.status(200).json({ status: true, data: category });
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const { name, slug, description, image, parentCategory } = req.body;
        let status = 'Pending';
        if (req.role && req.role.includes('admin')) {
            status = 'Active';
        }
        const newCategory = new Category({
            name, slug, description, image, parentCategory: parentCategory || null, status, createdBy: req.user
        });
        await newCategory.save();
        res.status(201).json({ status: true, message: 'Category created successfully', data: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: false, message: 'Category with this name or slug already exists' });
        }
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const { name, slug, description, image, parentCategory, status } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ status: false, message: 'Category not found' });
        if (name) category.name = name;
        if (slug) category.slug = slug;
        if (description) category.description = description;
        if (image) category.image = image;
        if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
        if (status) category.status = status;
        await category.save();
        res.status(200).json({ status: true, message: 'Category updated successfully', data: category });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: false, message: 'Category with this name or slug already exists' });
        }
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ status: false, message: 'Category not found' });
        res.status(200).json({ status: true, message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};
