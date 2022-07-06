const  AWS = require('aws-sdk');
const { NOT_FOUND, ACCEPTED, INTERNAL_SERVER_ERROR } = require('http-status');
const csv = require('csv-parser');

const { BUCKET, UPLOADED, PARSED, ACCESS_HEADERS } = require('../common/constants');

const sqs = new AWS.SQS();
// https://docs.aws.amazon.com/code-samples/latest/catalog/javascript-sqs-sqs_sendmessage.js.html

const sendMessage = (params) => {
    sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.error("Error", err);
        } else {
          console.log("Success", data.MessageId);
        }
      });
};

module.exports.importFileParser = async (event) => {
    const s3 = new AWS.S3({ region: process.env.REGION });
    AWS.config.update({ region: process.env.REGION });
    

    const results = [];

    if (!event.Records) {
        return {
            statusCode: NOT_FOUND
        }
    }

    try {
       
        for (record of event.Records) {
            const uploadedParams = {
                    Bucket: BUCKET,         
                    Key: record.s3.object.key
            };

            const parsedParams = {
                Bucket: BUCKET,                       
                CopySource: BUCKET + '/' + record.s3.object.key, 
                Key: record.s3.object.key.replace(UPLOADED, PARSED)   
            };

            const readStream = s3.getObject(uploadedParams).createReadStream(record.s3.object.key);           
            
             await new Promise((resolve, reject) => {
                readStream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('error', (error) => {
                    reject(error);
                })
                .on('end', async () => { 
                    results.forEach(fileData => 
                    console.log('Data from file: ', fileData));

                    await s3.copyObject(parsedParams).promise();
            
                    await s3.deleteObject(uploadedParams).promise();

                    
                    resolve( async() => {    
                        console.log(`File ${record.s3.object.key .split('/')[1]} has been imported & parsed`)
                    });
                });   
            });
                
            return {
                headers: ACCESS_HEADERS,
                statusCode: ACCEPTED
            }
        }

    } catch (e) {
        console.error(e);
        return {
            headers: ACCESS_HEADERS,
            statusCode: INTERNAL_SERVER_ERROR,
            body: JSON.stringify({ message: e })
        }
    }
};
