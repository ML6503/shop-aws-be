// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    name: 'basicAuthorizer'
    
    // events: [

    //       authorizer: {
    //         name: basicAuthorizer,
    //         arn: 'arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:authorization-service-dev-basicAuthorizer',
    //         resultTtlInSeconds: 0,
    //         identitySource: 'method.request.header.Authorization',
    //         type: 'token'
    //       },
    // ],
};
