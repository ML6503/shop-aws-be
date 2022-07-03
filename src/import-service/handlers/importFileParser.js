const  { S3 } = require('aws-sdk');
const { NOT_FOUND, ACCEPTED } = require('http-status');

const BUCKET = 'import-service-cyprushandmade';

const UPLOADED = 'uploaded';
const PARSED = 'parsed';

module.exports.importFileParser = async (event) => {
    const s3 = new S3({region: 'eu-west-1'});

    if (!event.Records) {
        return {
            statusCode: NOT_FOUND
        }
    }

    try {
        for (record of event.Records) {

        //     const s3Stream = s3.getObject(params).createReadStream();
        
        // s3Stream
        // .on('data', ())

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
                    statusCode: ACCEPTED
                }
        }    
    } catch (e) {
        console.error(e);
    }
};
