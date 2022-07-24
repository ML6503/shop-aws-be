
import { middyfy } from '@libs/lambda';
import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';


const createBasicAuthString = (string: string) => Buffer.from(string).toString('base64');

const compareToken = (token: string, user: string) => token === `Basic ${createBasicAuthString(`${user}:${process.env.user}`)}`


const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, _context, callback) => {
  const token: string = event.authorizationToken;
  let effect: string;

  if(!compareToken(token, 'user')) {
    effect = 'Deny';
    
  } if(!token) {
   callback('Unauthorized');
  } if(compareToken(token, 'user')) {
    effect = 'Allow';
  }  if(token && !effect){
    callback('Error: Invalid token');
  }

  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: event.methodArn
        }
      ]
    }
  };
  
};

export const main = middyfy(basicAuthorizer);
