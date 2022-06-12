import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        responses: {
          200: {
            description: 'Product received successfully',
            bodyType: 'IProduct'
          },
          404: {
            description: 'Product not found'
          },
          400: {
            description: 'Bad request. Product not found'
          }
        } 
      },
    },
  ],
};
