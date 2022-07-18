// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import basicAuthorizer  from '@functions/basicAuthorizer.ts';

export default {
  tokenAuth: {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
      {
        http: {
          method: 'get',
          path: 'token',
          cors: true,
          authorizer: {
            name: basicAuthorizer,
            arn: 'arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:authorization-service-dev-basicAuthorizer',
            resultTtlInSeconds: 0,
            identitySource: 'method.request.header.Authorization',
            type: 'token'
          },
        },
      },
    ],
  }
 
};
