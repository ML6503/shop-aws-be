import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src/service/productService';

export const getProductsList = async () => {
 try {
    const productService = new ProductService;
    const allProducts = await productService.getAllProducts();

    return formatJSONResponse({
      products: allProducts,
      
    });
 } catch (e) {
    console.error(e);
 }
}

export const main = middyfy(getProductsList);
