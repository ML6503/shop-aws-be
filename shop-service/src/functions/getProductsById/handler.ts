import { errorNoProductResponse, errorServerResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src/service/productService';

import schema from './schema';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    let product = null;
  
    if (event.pathParameters && event.pathParameters.productId) {
      const { productId } = event?.pathParameters;
      const productService = new ProductService;
      product = await productService.getProductById(productId);    
    }

    return product
      ? formatJSONResponse({
          product: product,    
        })
      : errorNoProductResponse;

  } catch (e) {
    console.error(e);
    return errorServerResponse;
  }
};

export const main = middyfy(getProductsById);
