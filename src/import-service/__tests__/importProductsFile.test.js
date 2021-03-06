const AWS  = require('aws-sdk-mock');
const { promisify } = require('util');

const { importProductsFile } = require('../handler');
const eventStub = require('./stubs/httpApiGatewayEvent.json');

const handler = promisify(importProductsFile);

describe('importProductFile signed uploads', () => {

    beforeAll(() => {
        AWS.mock('S3', 'getSignedUrl', (method, _, callback) => {
           callback(null, {
               data: 'https:// example.com'
           }); 
        })
    });

    afterAll(() => {
        AWS.restore('S3'); 
    });

    test('should send string link for a signed upload on success', () => {
        const event = eventStub;
        const context = {};
    
        const result = handler(event, context);
        result.then(data => expect(data).toMatchSnapshot());

    });
});


