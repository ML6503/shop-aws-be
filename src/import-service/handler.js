import { S3 } from 'aws-sdk';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, NOT_FOUND, ACCEPTED } from 'http-status';

const BUCKET = 'import-service-cyprushandmade';
const IMPORT = 'import';
const UPLOADED = 'uploaded';
const PARSED = 'parsed';

export async function importProductsFile(event) {
    if (!event.queryStringParameters.name) {
        throw new Error(BAD_REQUEST);
    }

    const fileName = event.queryStringParameters.name;

    const s3 = new S3({ region: 'eu-west-1' });
    const params = {
        Bucket: BUCKET,
        Prefix: `${UPLOADED}/`
    };

    let body = {};
    let files = [];

    try {
        const s3response = await s3.listObjectsV2(params).promise();
        files = s3response.Contents;
        body = JSON.stringify(
            files.filter(file => file.Size)
                .map(file => `https://${BUCKET}.s3.eu-west-1.amazonaws.com/${file.Key}`)
        );
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
}
export async function importFileParser(event) {
    const s3 = new S3({ region: 'eu-west-1' });

    if (!event.Records) {
        return {
            statusCode: NOT_FOUND
        };
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

            console.log(`File ${record.s3.object.key.split('/')[1]} has been imported`);

            return {
                statusCode: ACCEPTED
            };
        }

    } catch (e) {
        console.error(e);
    }
}

 
