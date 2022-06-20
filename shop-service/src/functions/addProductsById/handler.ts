import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, errorBadRequest } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { AddProductRequest }  from './schema';


const addProductsById: ValidatedEventAPIGatewayProxyEvent<typeof AddProductRequest> = async (event) => {
  const {title, description, price, count} = event?.body;
  if(!title || !price) {
    return errorBadRequest;
  }
  return formatJSONResponse({
    message: `Product with title: ${title} has been added.`,
    event,
  });
};

export const main = middyfy(addProductsById);
