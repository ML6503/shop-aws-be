import { errorServerResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, errorBadRequest } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import ProductService from 'src-product/service/productService';
import { AddProductRequest }  from './schema';


const addProduct: ValidatedEventAPIGatewayProxyEvent<typeof AddProductRequest> = async (event) => {
  const { title, description, price, count } = event?.body;
  if(!event.body || !title || !price) {
    return errorBadRequest;
  }
    console.log('Request details from postProductsById: ', event.body);
  try {
    const productService = new ProductService;
    const addedProduct = await productService.addProduct({ title, description, price, count });
   
    console.log('addedProduct ', addedProduct );
  
  return formatJSONResponse({
    message: `Product with title: ${title} has been added.`,
    product: addedProduct,
  });
   
  } catch (err) {
     console.error(err);
    if(err.statusCode < errorServerResponse.statusCode) {
      return err;
    }
    return errorServerResponse;
  }
};

export const main = middyfy(addProduct);
