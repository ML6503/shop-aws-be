const AWS = require('aws-sdk');
const {
    S3Client,
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { NOT_FOUND, ACCEPTED, INTERNAL_SERVER_ERROR } = require('http-status');
const csv = require('csv-parser');
const { unhandledErrorCatch } = require('../common/error');
const {
    BUCKET,
    UPLOADED,
    PARSED,
    ACCESS_HEADERS,
} = require('../common/constants');

const sqs = new AWS.SQS();

const sendMessage = (fileData) => {
    sqs.sendMessage(
        {
            QueueUrl: process.env.SQS_QUEUE_URL,
            MessageBody: JSON.stringify(fileData),
        },
        (err, data) => {
            if (err) {
                console.error(err);
                throw Error('Send MessageError', err);
            }
            console.log('message sent with body:', JSON.stringify(fileData));
            console.log('cb data:', data);
        }
    );
};

module.exports.importFileParser = async (event, _context, callback) => {
    const client = new S3Client({ region: process.env.REGION });

    AWS.config.update({ region: process.env.REGION });

    const results = [];

    if (!event.Records) {
        callback(
            {
                statusCode: NOT_FOUND,
            },
            null
        );
    }

    try {
        for (record of event.Records) {
            const uploadedParams = {
                Bucket: BUCKET,
                Key: record.s3.object.key,
            };

            const parsedParams = {
                Bucket: BUCKET,
                CopySource: BUCKET + '/' + record.s3.object.key,
                Key: record.s3.object.key.replace(UPLOADED, PARSED),
            };
            // read uploaded file data
            const getCommand = new GetObjectCommand(uploadedParams);
            const dataReadStream = await client.send(getCommand);

            const { Body } = dataReadStream;

            Body.pipe(csv())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', async () => {
                    console.log('Resuls from stream: ', results);
                    results.forEach((fileData) => {
                        sendMessage(fileData);
                    });
                    // copy file
                    const copyCommand = new CopyObjectCommand(parsedParams);
                    await client.send(copyCommand);
                    // delete file in upload
                    const deleteCommand = new DeleteObjectCommand(
                        uploadedParams
                    );
                    await client.send(deleteCommand);
                })
                .on('error', (err) => {
                    console.error(err);
                    callback(
                        {
                            statusCode: INTERNAL_SERVER_ERROR,
                            body: JSON.stringify(err),
                        },
                        null
                    );
                });

            callback(null, {
                headers: ACCESS_HEADERS,
                statusCode: ACCEPTED,
            });
        }
    } catch (e) {
        console.error(e);
        callback(
            {
                headers: ACCESS_HEADERS,
                statusCode: INTERNAL_SERVER_ERROR,
                body: JSON.stringify({ message: e }),
            },
            null
        );
    }

    unhandledErrorCatch();
};
