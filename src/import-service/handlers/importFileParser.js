const  { S3 } = require('aws-sdk');
const { NOT_FOUND, ACCEPTED, INTERNAL_SERVER_ERROR } = require('http-status');
const csv = require('csv-parser');

const { BUCKET, UPLOADED, PARSED, ACCESS_HEADERS } = require('../common/constants');


module.exports.importFileParser = async (event) => {
    const s3 = new S3({region: 'eu-west-1'});
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
        
            readStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('error', (error) => {
                throw Error(error);
            })
            .on('end', () => results.forEach(fileData => console.log('Data from file: ', fileData)));   

            await s3.copyObject(parsedParams).promise();
        
            await s3.deleteObject(uploadedParams).promise();
                
            console.log(`File ${record.s3.object.key .split('/')[1]} has been imported`);
        
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