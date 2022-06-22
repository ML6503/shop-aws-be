import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, errorBadRequest } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src/service/productService';
import { AddProductRequest }  from './schema';


const addProductsById: ValidatedEventAPIGatewayProxyEvent<typeof AddProductRequest> = async (event) => {
  const { title, description, price, count } = event?.body;
  if(!title || !price) {
    return errorBadRequest;
  }

  try {
    const productService = new ProductService;
   const addedProduct = await productService.addProduct({ title, description, price, count });
   
  console.log('Request details from postProductsById: ', event);
  
  return formatJSONResponse({
    message: `Product with title: ${title} has been added.`,
    addedProduct,
  });
   
  } catch (err) {
    console.log(err);
  }
};

export const main = middyfy(addProductsById);
