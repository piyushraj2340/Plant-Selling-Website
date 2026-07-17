const flatStrategy = require('./flat.strategy');
const percentStrategy = require('./percent.strategy');

module.exports = {
    getStrategy: (discountType) => {
        if (discountType === 'Flat') {
            return flatStrategy;
        } else if (discountType === 'Percentage') {
            return percentStrategy;
        }
        throw new Error(`Unsupported discount type: ${discountType}`);
    }
};
