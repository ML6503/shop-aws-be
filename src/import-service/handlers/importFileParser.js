const  { S3 } = require('aws-sdk');
const { NOT_FOUND, ACCEPTED } = require('http-status');
const csv = require('csv-parser');

const BUCKET = 'import-service-cyprushandmade';

const UPLOADED = 'uploaded';
const PARSED = 'parsed';
const accessHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Credentials": true
  };


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
            const params = {
                    Bucket: BUCKET,         
                    Key: record.s3.object.key
            };

            const s3Stream = s3.getObject(params).createReadStream(record.s3.object.key);
        
            s3Stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('error', (error) => {
                throw Error(error.stack);
            })
            .on('end', () => results.forEach(file => console.log(file)));
    

           

                await s3.copyObject({
                    Bucket: BUCKET,                       
                    CopySource: BUCKET + '/' + record.s3.object.key, 
                    Key: record.s3.object.key.replace(UPLOADED, PARSED)   
                }).promise();
        
                await s3.deleteObject(params).promise();
                
                console.log(`File ${record.s3.object.key .split('/')[1]} has been imported`);
        
                return {
                    headers: accessHeaders,
                    statusCode: ACCEPTED
                }
        }    
    } catch (e) {
        console.error(e);
    }
};
