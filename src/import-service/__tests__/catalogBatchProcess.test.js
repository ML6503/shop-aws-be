const AWS = require('aws-sdk-mock');
const { catalogBatchProcess } = require('../handler');

beforeEach(async (done) => {
    
    done();
});

afterEach(async (done) => {
    AWS.restore();
    done();
});

describe('check catalogBatchProcess to publish', async () => {
    it('should publish new product', () => {
        const snsMocked = AWS.mock('SNS', 'publish', 'Dagger, Dagger damascus, 100, 10');
        const classifiedRequestId = "12345";
        const event = {
            Records: [
              {
                body: JSON.stringify({
                    "title": "Dagger",
                    "description": "Dagger damascus",
                    "price": "100",
                    "count": "10",
                    classifiedRequestId,
                }),
              }
            ]
          };
      
          await catalogBatchProcess(event);

          expect (snsMocked.publish).toHaveBeenCalledWith({
            
                Message: JSON.stringify({
                  type: 'Dagger, Dagger damascus, 100, 10',
                  data: {
                    id: classifiedRequestId,
                  }
                }),
                TopicArn: process.env.SNS_ARN
          });
    });
});
