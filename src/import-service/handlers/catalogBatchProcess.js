const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { AlexaForBusiness } = require('aws-sdk');
const AWS = require('aws-sdk');
const { ACCEPTED, OK } = require('http-status');
const { unhandledErrorCatch } = require('../common/error');
// const { ProductService } = require('../dbService/productService');
const snsClient = new SNSClient({ region: process.env.REGION });
AWS.config.region = process.env.REGION;
const lambda = new AWS.Lambda();

module.exports.catalogBatchProcess = async (event, context) => {
    console.log('We are in BatchProcess!!');
    try {
        // const productService = new ProductService();

        await event.Records.map(async ({ body }) => {
            // get new product from event and add to Data Base
            // let newProduct = await JSON.parse(body);
            // console.log('NEW PRODUCT DATA FROM BODY', newProduct);
            console.log('NEW PRODUCT DATA FROM BODY', body);

            const addProduct = await axios.post(
                `https://rxqgzhje6j.execute-api.eu-west-1.amazonaws.com/dev/products`,
                body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Headers':
                            'Origin, X-Requested-With, Content-Type, Accept',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': '*',
                    },
                }
            );

            // let addedProduct = await productService.addProduct(newProduct);

            // console.log('addedProduct ', addedProduct);

            if (addProduct.statusCode === OK) {
                const addedProduct = await JSON.parse(body);
                // publish at sns topic
                const publishCommandParams = {
                    Subject: 'New product has been added to DB',
                    Message: JSON.stringify(addedProduct),
                    TopicArn: process.env.SNS_ARN,
                    MessageAttributes: {
                        title: {
                            DataType: 'String',
                            StringValue: addedProduct.title,
                        },
                    },
                };
                const publishCommand = new PublishCommand(publishCommandParams);

                await snsClient.send(publishCommand);
            }
        });
    } catch (err) {
        console.error(err);
    }

    unhandledErrorCatch();

    return {
        statusCode: ACCEPTED,
        body: JSON.stringify('Records have been processed'),
    };
};
