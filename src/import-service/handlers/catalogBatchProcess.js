const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const axios = require('axios');
const { OK, ACCEPTED } = require('http-status');
const { ACCESS_HEADERS } = require('../common/constants');
const { unhandledErrorCatch } = require('../common/error');

module.exports.catalogBatchProcess = async (event) => {
    const snsClient = new SNSClient({ region: process.env.REGION });

    for (const record of event.Records) {
        try {
            // get new product from event and add to Data Base
            console.log('DATA for DB in JSON: ', record.body);
            const addProductResponse = await axios.post(
                'https://rxqgzhje6j.execute-api.eu-west-1.amazonaws.com/dev/products',
                JSON.parse(record.body),
                {
                    headers: ACCESS_HEADERS,
                }
            );

            if (addProductResponse.statusCode === OK) {
                const addedProduct = await JSON.parse(record.body);
                // publish at sns topic
                const publishCommandParams = {
                    Subject: 'New product has been added to DB',
                    Message: `${addedProduct.title}, ${addedProduct.description}, ${addedProduct.price}, ${addedProduct.count}`,
                    TopicArn: process.env.SNS_ARN,
                    MessageAttributes: {
                        title: {
                            DataType: 'String',
                            StringValue: addedProduct.title.includes('Dagger')
                                ? 'dagger'
                                : addedProduct.title.includes('Knife')
                                ? 'knife'
                                : `${addedProduct.title}`,
                        },
                    },
                };
                const publishCommand = new PublishCommand(publishCommandParams);

                await snsClient.send(publishCommand);
            }
        } catch (err) {
            console.error(err);
        }
    }

    unhandledErrorCatch();

    return {
        headers: ACCESS_HEADERS,
        statusCode: ACCEPTED,
    };
};
