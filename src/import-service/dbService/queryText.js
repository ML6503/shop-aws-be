const INSERT_ONE_PRODUCT =
    'INSERT INTO product (title, description, price) VALUES ($1, $2, $3) returning *';

const INSERT_ONE_PRODUCT_STOCK =
    'INSERT INTO stocks (product_id, count) VALUES ($1, $2)';

const UUID = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

const CREATE_TABLE_PRODUCT = `create table IF NOT EXISTS "product" (
    "id" uuid not null DEFAULT uuid_generate_v4 () PRIMARY KEY,
    "title" text not null unique,
    "description" text,
    "price" integer
    )`;

const CREATE_TABLE_STOCK = `create table IF NOT EXISTS "stocks" (
    "product_id" uuid references product("id"),
    "count" integer
    )`;

module.exports = {
    UUID,
    CREATE_TABLE_STOCK,
    CREATE_TABLE_PRODUCT,
    INSERT_ONE_PRODUCT,
    INSERT_ONE_PRODUCT_STOCK,
};
