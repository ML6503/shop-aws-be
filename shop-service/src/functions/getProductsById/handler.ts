import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src/service/productService';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let product = null;
  console.log('event from getProductById: ', event);

  if (event.pathParameters && event.pathParameters.productId) {
    const { productId } = event.pathParameters;
    const productService = new ProductService;
    product = await productService.getProductById(productId);    
  }

  return product
    ? formatJSONResponse({
        product: product,    
      })
    : {
      statusCode: 404,
      body: JSON.stringify({ error: 'Product not found' })
    };
};

export const main = middyfy(getProductsById);
