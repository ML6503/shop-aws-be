import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const accessHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*"
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: accessHeaders,
    body: JSON.stringify(response)
  }
};

export const errorServerResponse = {
  statusCode: 500,
    headers: accessHeaders,
    body: JSON.stringify({ message: 'Internal Server Error' })
};

export const errorNoProductResponse = {
  statusCode: 404,
    headers: accessHeaders,
    body: JSON.stringify({ message: 'Product not found' })
};

export const errorBadRequest = {
  statusCode: 400,
    headers: accessHeaders,
    body: JSON.stringify({ message: 'Not all details provided' })
};
