const { PG_DATABASE, PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
    host: PG_HOST,
    port: +PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false, // until  ap without authorization
    },
    connectionTimeoutMillis: 10000, // time to terminate DB query in milliseconds
};

module.exports = {
    dbOptions
};
