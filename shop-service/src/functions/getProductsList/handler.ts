import { errorServerResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { loggerWrapper } from '@libs/logger';
import ProductService from 'src/service/productService';

export const getProductsList = async () => {
 try {
  
    const productService = new ProductService;
   //  const allProducts = await productService.getAllProducts();
   const allProducts = await productService.getAllProductsWzStock();

    return formatJSONResponse({
      products: allProducts,
      
    });
 } catch (e) {
    console.error(e);
    return errorServerResponse;
 }
}

export const main = middyfy(getProductsList);
