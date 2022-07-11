const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { ACCEPTED } = require('http-status');
const { unhandledErrorCatch } = require('../common/error');
import ProductService from '../dbService/productService';

module.exports.catalogBatchProcess = async (event) => {
    console.log('We are in BatchProcess!!');
    try {
        const snsClient = new SNSClient({ region: process.env.REGION });
        
        const productService = new ProductService;

        await event.Records.map(({ body }) => {
            // get new product from event and add to Data Base
            let newProduct = await JSON.parse(body);
            console.log('NEW PRODUCT DATA FROM BODY', newProduct);

            let addedProduct = await productService.addProduct(newProduct);
   
            console.log('addedProduct ', addedProduct );
            // publish at sns topic
            const publishCommandParams = {
                Subject: 'New product has been added to DB',
                Message: JSON.stringify(addedProduct),
                TopicArn: process.env.SNS_ARN,
                MessageAttributes: {
                    title: {
                        DataType: 'String',
                        StringValue: addedProduct.title
                    }
                }
            };
            const publishCommand = new PublishCommand(publishCommandParams);

            await snsClient.send(publishCommand);

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
