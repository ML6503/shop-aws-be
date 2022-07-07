const { OK } = require("http-status");

module.exports.catalogBatchProcess = async (event) => {
    await event.Records.forEach(record => {
        const { body } = record.Records
        console.log('message', body);
    });
    
    return {
        statusCode: OK,
        body: JSON.stringify('Records have been processed')
    }
};