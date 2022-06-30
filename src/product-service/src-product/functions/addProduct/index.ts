// import { AddProductRequest, AddProductResponse} from './schema';
import { AddProductResponse} from './schema';
import { handlerPath } from '@libs/handler-resolver';


export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        // headers: accessHeaders,
        // request: {
        //   schemas: {
        //     'application/json': AddProductRequest,
        //   },
        // },
        responses: {
          200: {
            description: 'Product created successfully',
            bodyType: JSON.stringify(AddProductResponse),
          },
          400: {
            description: 'Bad request.'
          }
        }
      },
    },
  ],
};