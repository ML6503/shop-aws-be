module.exports.unhandledErrorCatch = () => {
    process.on('unhandledRejection', (error) => {
        console.error('unhandledRejection Error: ', error);
        process.exit(1);
    });
};
