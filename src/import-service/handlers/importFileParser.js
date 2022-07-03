const status  =  require('http-status');
const AWS =  require('aws-sdk');

const BUCKET = 'import-service-cyprushandmade';
const IMPORT = 'import';
const UPLOADED = 'uploaded';
const PARSED = 'parsed';

export default async function importFileParser (event) {
    const s3 = new AWS.S3({region: 'eu-west-1'});

    if (!event.Records) {
        return {
            statusCode: status.NOT_FOUND
        }
    }

    try {
        for (record of event.Records) {
                await s3.copyObject({
                    Bucket: BUCKET,                       
                    CopySource: BUCKET + '/' + record.s3.object.key, 
                    Key: record.s3.object.key.replace(UPLOADED, PARSED)   
                }).promise();
        
                await s3.deleteObject({
                    Bucket: BUCKET,         
                    Key: record.s3.object.key  
                }).promise();
                
                console.log(`File ${record.s3.object.key .split('/')[1]} has been imported`);
        
                return {
                    headers: {'Access-Control-Allow-Origin': '*'},
                    statusCode: status.ACCEPTED
                }
        }    
    } catch (e) {
        console.error(e);
    }
};
