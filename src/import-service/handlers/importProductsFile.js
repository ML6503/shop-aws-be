const { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } = require('http-status');
const  { S3 } = require('aws-sdk');
const { ACCESS_HEADERS, BUCKET, UPLOADED } = require('../common/constants');

const s3 = new S3({ region: 'eu-west-1', signatureVersion: 'v4' });

module.exports.importProductsFile = async (event) => {    

    let body = {};
    console.log('event query string params: ', event.queryStringParameters.name);
    if (!event.queryStringParameters.name) {
        body = JSON.stringify({ message: 'Your request is missing some params.' }, null, 2);
        
        return {
            statusCode: BAD_REQUEST,
            headers: ACCESS_HEADERS,
            body
        };
    }
    
    const fileName = event.queryStringParameters.name;

    try {

        const params = {
            Bucket: BUCKET,
            Key: `${UPLOADED}/${fileName}`,    
            ContentType: 'text/csv'
        };
       
        const url = await s3.getSignedUrlPromise('putObject', params);
   
        body  = JSON.stringify(url , null, 2);
      
        console.log('BODY: ', body);
             
    } catch (e) {
        console.error('Error: ', e);
        statusCode = INTERNAL_SERVER_ERROR;
        body = e;
    }        
   
    return {
        statusCode: OK,
        headers: ACCESS_HEADERS,
        body
    };
};
