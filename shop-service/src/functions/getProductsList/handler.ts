import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src/service/productService';

const getProductsList = async () => {
  const productService = new ProductService;
  const allProducts = await productService.getAllProducts();

  return formatJSONResponse({
    products: allProducts,
    
  });
}

export const main = middyfy(getProductsList);
