import { formatJSONUnauthResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const basicAuthorizer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  if (event['type'] !== 'token') {
    return formatJSONUnauthResponse({
      message: 'User is unauthorized'
    });

  }
  return formatJSONResponse({
    message: `Authorized!`,
    
  });
};

export const main = middyfy(basicAuthorizer);
