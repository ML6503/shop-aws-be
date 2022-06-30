import AWS from 'aws-sdk';
const BUCKET = 'import-service-cyprushandmade';

export default {
    importProductsFile: async () => {
        const s3 = new AWS.S3({region: 'eu-west-1'});
        const params = {
            Bucket: BUCKET,
            Prefix: 'uploaded/'
        };
        let statusCode = 200;
        let body = {};
        let files = [];

        try {
            const s3response = await s3.listObjectsV2(params).promise();
            files = s3response.Contents;
            body = JSON.stringify(
                files.filter(file => file.Size)
                .map(file => `htpps://${BUCKET}.s3.amazonaws.com/${ file.Key }`)
            );
        } catch (e) {
            console.error('Error: ', e);
            statusCode = 500;
            body = e;
        }

        return {
            statusCode,
            headers: {'Access-Control-Allow-Origin': '*'},
            body
        };
    }
}