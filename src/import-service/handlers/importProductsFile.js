const { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } = require('http-status');
const  { S3 } = require('aws-sdk');

const s3 = new S3({region: 'eu-west-1'});
const BUCKET = 'import-service-cyprushandmade';
const UPLOADED = 'uploaded';

const accessHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Credentials": true
  };

module.exports.importProductsFile = async (event) => {    

    let body = {};
    console.log('event query string params: ', event.queryStringParameters.name);
    if (!event.queryStringParameters.name) {
        body = JSON.stringify({ message: 'Your request is missing some params.' });
        
        return {
            statusCode: BAD_REQUEST,
            headers: accessHeaders,
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
       
        
       s3.getSignedUrl('putObject', params, (error, url) => {
           if(error) {
               throw Error(error);
           }
           body = JSON.stringify({ url });
       });
      
       
             
    } catch (e) {
        console.error('Error: ', e);
        statusCode = INTERNAL_SERVER_ERROR;
        body = e;
    }        
   
    return {
        statusCode: OK,
        headers: accessHeaders,
        body
    };
};
