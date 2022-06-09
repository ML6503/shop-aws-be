import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src/service/productService';

import schema from './schema';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;
  const productService = new ProductService;
  const product = await productService.getProductById(productId);
  console.log('event from getProductById: ', event);

  return formatJSONResponse({
    product: product,
    
  });
};

export const main = middyfy(getProductById);
