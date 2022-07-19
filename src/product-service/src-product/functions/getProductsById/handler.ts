import { errorNoProductResponse, errorServerResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src-product/service/productService';
import { IProductWzStock } from 'src-product/types/product';
import schema from './schema';


export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;

  try {
    let product: IProductWzStock;
  
    if (event?.pathParameters && event.pathParameters?.productId) {
     
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
    if(e.statusCode < 500) {
      return e;
    }
    return errorServerResponse;
  }
};

export const main = middyfy(getProductsById);
