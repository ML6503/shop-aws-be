const { INSERT_ONE_PRODUCT, INSERT_ONE_PRODUCT_STOCK } = require('./queryText');

const addProductQuery = (product) => {
    const { title, description, price } = product;
    if (
        typeof title !== 'string' ||
        typeof price !== Number ||
        typeof description !== 'string'
    ) {
        throw Error('DB Type param error!');
    }

    return {
        text: INSERT_ONE_PRODUCT,
        value: [`${title}`, `${description}`, price],
    };
};

const addProductStock = (productId, count) => {
    if (typeof productId !== 'string' || typeof count !== Number) {
        throw Error('DB Type param error!');
    }

    return {
        text: INSERT_ONE_PRODUCT_STOCK,
        value: [`${productId}`, count],
    };
};

const getOneProductWzStock = (productId) => {
    if (typeof productId !== 'string') {
        throw Error('DB Type param error!');
    }

    return {
        text: SELECT_ONE_PRODUCT_WITH_STOCK_BY_ID,
        value: [productId],
    };
};

module.exports = {
    addProductQuery,
    addProductStock,
    getOneProductWzStock,
};
