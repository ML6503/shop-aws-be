import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer.ts';

const serverlessConfiguration: AWS = {
    service: 'authorization-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        logRetentionInDays: 14,
        httpApi: {
            cors: true,
        },
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    // import the function via paths
    functions: { basicAuthorizer },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
    resources: {
        Resources: {
            ApiGatewayRestApi: {
                Type: 'AWS::ApiGateway::RestApi',
                Properties: {
                    Name: 'authorization-service-cyprushandmade-dev',
                },
            },
            GatewayResponseDefault4XX: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    RestApiId: {
                        Ref: 'ApiGatewayRestApi',
                    },
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin':
                            "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers':
                            "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Methods':
                            "'GET,OPTIONS'",
                        // 'method.response.header.Content-Type': "'application/json'",
                        // 'method.response.header.Access-Control-Allow-Origin': "'*'",
                        // 'method.response.header.Access-Control-Allow-Credentials': "'true'"
                    },
                    ResponseType: 'DEFAULT_4XX',
                    ResponseTemplates: {
                        'application/json':
                            '{"error":{"code":"custom-4XX-generic","message":$context.error.messageString},"requestId":"$context.requestId"}',
                    },
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
