const { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } = require('http-status');
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { S3Client } =require("@aws-sdk/client-s3");

const BUCKET = 'import-service-cyprushandmade';
const UPLOADED = 'uploaded';


module.exports.importProductsFile = async (event) => {
    
    const client = new S3Client({region: 'eu-west-1'});
    let body = {};
    console.log('event query string params: ', event.queryStringParameters.name);
    if (!event.queryStringParameters.name) {
        body = JSON.stringify({ message: 'Your request is missing some params.' }, null, 2);
        return {
            statusCode: BAD_REQUEST,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body
        };
    }
    
    const fileName = event.queryStringParameters.name;

    try {

        const params = {
            Bucket: BUCKET,
            Key: `${UPLOADED}/${fileName}`
        };  
        
        const { url } = await createPresignedPost(client, params);
      
        body = JSON.stringify({ url }, null, 2);
             
    } catch (e) {
        console.error('Error: ', e);
        statusCode = INTERNAL_SERVER_ERROR;
        body = e;
    }        
   
    return {
        statusCode: OK,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body
    };
};
