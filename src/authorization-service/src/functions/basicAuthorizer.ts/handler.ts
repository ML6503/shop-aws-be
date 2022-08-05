import { middyfy } from '@libs/lambda';
import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
    event,
    _context,
    callback
) => {
    console.log('EVENT', event);
    const USER = process.env.USER;

    const createBasicAuthString = (string: string) =>
        Buffer.from(string).toString('base64');

    const compareToken = (token: string) =>
        token ===
        `Basic ${createBasicAuthString(`${USER}:${process.env[USER]}`)}`;

    const token: string = event.authorizationToken;
    let effect: string;

    console.log('USER: ', USER);
    console.log('PASWORD: ', process.env[USER]);
    console.log('TOKEN: ', token);

    if (!compareToken(token)) {
        effect = 'Deny';
    }
    if (!token) {
        callback('Unauthorized');
    }
    if (compareToken(token)) {
        effect = 'Allow';
    }
    if (token && !effect) {
        callback('Error: Invalid token');
    }

    return {
        principalId: USER,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: event.methodArn,
                },
            ],
        },
    };
};

export const main = middyfy(basicAuthorizer);
