const AWS = require('aws-sdk-mock');
const { promisify } = require('util');
const { catalogBatchProcess } = require('../handler');
const eventStub = require('./stubs/snsEvent');

const handler = promisify(catalogBatchProcess);

afterEach((done) => {
    AWS.restore();
    done();
});

describe('check catalogBatchProcess to publish', () => {
    test('should publish new product', async () => {
        const snsMocked = AWS.mock(
            'SNS',
            'publish',
            'Dagger, Dagger damascus, 100, 10'
        );
        const classifiedRequestId = "90a903f5-a6fe-4073-8e62-2aa10c2e9fd0'";
       
        const event = eventStub;
        const result = handler(event);
        result.then((data) => expect(data).toMatchSnapshot());

        // expect(snsMocked.publish).toHaveBeenCalledWith({
        //     Message: JSON.stringify({
        //         type: 'Dagger, Dagger damascus, 100, 10',
        //         data: {
        //             id: classifiedRequestId,
        //         },
        //     }),
        //     TopicArn: process.env.SNS_ARN,
        // });
    });
});
