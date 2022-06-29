import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult, APIGatewayProxyHandler } from "aws-lambda";

type Logger = (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback<APIGatewayProxyResult>,
  ) => void | Promise<APIGatewayProxyResult>;
  
  export function loggerWrapper(func: APIGatewayProxyHandler): Logger {
    const funcName = func.name;
    return (...args): void | Promise<APIGatewayProxyResult> => {
     
      const message = funcName + ' called';
      console.info('Logger logs: ', message, args);
      const results = func(...args);
      return results;
    };
  }