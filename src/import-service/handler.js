import AWS from 'aws-sdk';
const BUCKET = 'import-service-cyhandmade';

export default {
    imagesList: async () => {
        const s3 = new AWS.S3({region: 'eu-west-1'});
        const params = {
            Bucket: BUCKET,
            Prefix: 'images/'
        };
        let statusCode = 200;
        let body = {};
        let images = [];

        try {
            const s3response = await s3.listObjectsV2(params).promise();
            images = s3response.Contents;
            body = JSON.stringify(
                images.filter(img => img.Size)
                .map(img => `htpps://${BUCKET}.s3.amazonaws.com/${ img.Key }`)
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