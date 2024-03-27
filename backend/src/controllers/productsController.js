const plantsModel = require('../model/plants');

exports.getAllPlants = async (req, res, next) => {
    try {
        const result = await plantsModel.find();

        const info = {
            status: true,
            message: "Data of all products",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};


exports.getPlantById = async (req, res, next) => {
    try {
        const _id = req.params.id;
        const result = await plantsModel.findOne({ _id }).populate("nursery"); // Populate nursery details

        // Assuming there's a method increaseVisit() defined in the plant model
        await result.increaseVisit();

        const info = {
            status: true,
            message: "Data of Product",
            result
        };
        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};


exports.getPlantsByCategory = async (req, res, next) => {
    try {
        const category = req.params.id;
        const result = await plantsModel.find({ category });

        const info = {
            status: true,
            message: `Data For ${category}`,
            result
        };

        res.status(200).send(info);
    } catch (error) {
        next(error);
    }
};
