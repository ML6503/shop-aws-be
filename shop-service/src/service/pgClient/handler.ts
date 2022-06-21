import { Client } from 'pg';
import { errorServerResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const { PG_DATABASE, PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
    host: PG_HOST,
    port: +PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // until  ap wihtout authorization
    },
    connectionTimeoutMillis: 5000 // time to terminate DB query in milliseconds
};

const invoke = async() => {
    const client = new Client(dbOptions);
    await client.connect();
    try {
        const uuidExt = await client.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp" 
        `);

        const productsTable = await client.query(`
        create table IF NOT EXISTS product (
            id uuid not null DEFAULT uuid_generate_v4 () PRIMARY KEY,
            title text not null unique,
            description text,
            price integer
             
        )`);

        const stocksTable = await client.query(`
            create table IF NOT EXISTS stocks (
            product_id uuid,
            count integer,
            foreign key ("product_id") references "product" ("id"),
        )`);

        console.log('products table', productsTable );
        console.log('stocks', stocksTable );

    } catch(error) {
        console.error(error);
        return errorServerResponse;
    } finally {
        await client.end();
    }   
};

export default invoke;
