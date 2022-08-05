import { INewProduct } from '../../types/product';
import {
    DELETE_ONE_PRODUCT_BY_ID,
    SELECT_ONE_PRODUCT_WITH_STOCK_BY_ID,
    INSERT_ONE_PRODUCT,
    INSERT_ONE_PRODUCT_STOCK,
    UPDATE_PRODUCT_TITLE,
    UPDATE_PRODUCT_PRICE,
    UPDATE_PRODUCT_DESCRIPTION,
    UPDATE_PRODUCT_STOCK,
} from './queryText';

const deleteProductAndStock = (productId: string) => {
    return {
        text: DELETE_ONE_PRODUCT_BY_ID,
        value: [productId],
    };
};

const getOneProductWzStock = (productId: string) => {
    return {
        text: SELECT_ONE_PRODUCT_WITH_STOCK_BY_ID,
        value: [productId],
    };
};

const addProductQuery = (product: INewProduct) => {
    const { title, description, image, price } = product;
    return {
        text: INSERT_ONE_PRODUCT,
        value: [`${title}`, `${description}`, `${image ? image : ''}`, price],
    };
};

const addProductStock = (productId: string, count: number) => {
    return {
        text: INSERT_ONE_PRODUCT_STOCK,
        value: [`${productId}`, count],
    };
};

const updateProductTitle = (productId: string, title: string) => {
    return {
        text: UPDATE_PRODUCT_TITLE,
        value: [productId, title],
    };
};

const updateProductPrice = (productId: string, price: number) => {
    return {
        text: UPDATE_PRODUCT_PRICE,
        value: [productId, price],
    };
};

const updateProductDescr = (productId: string, description: string) => {
    return {
        text: UPDATE_PRODUCT_DESCRIPTION,
        value: [productId, description],
    };
};

const updateProductStock = (productId: string, count: number) => {
    return {
        text: UPDATE_PRODUCT_STOCK,
        value: [productId, count],
    };
};

export {
    updateProductDescr,
    updateProductPrice,
    updateProductStock,
    updateProductTitle,
    addProductQuery,
    addProductStock,
    getOneProductWzStock,
    deleteProductAndStock,
};
