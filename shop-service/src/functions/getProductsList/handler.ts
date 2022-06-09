import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src/service/productService';

import schema from './schema';

// const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   return formatJSONResponse({
//     message: `Hello world, welcome to the exciting Serverless world!`,
//     event,
//   });
// };

const getProductsList = async () => {
  const productService = new ProductService;
  const allProducts = await productService.getAllProducts();

  return formatJSONResponse({
    products: allProducts,
    
  });
}

export const main = middyfy(getProductsList);
