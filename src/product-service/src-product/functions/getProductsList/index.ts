import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responses: {
          200: {
            description: 'all products received successfully',
            bodyType: typeof(Array),
          },
          400: {
            description: 'Bad request. Product not found'
          }
        }
      },
    },
  ],
};
