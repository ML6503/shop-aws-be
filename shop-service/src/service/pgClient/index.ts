import { Client } from 'pg';

const { PG_DATABASE, PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD } = process.env;

export const dbOptions = {
    host: PG_HOST,
    port: +PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // until  ap wihtout authorization
    },
    connectionTimeoutMillis: 10000 // time to terminate DB query in milliseconds
};

export default class PGClient extends Client {
  
  constructor(config = dbOptions) {
    
    super(config);

    this.start();
  }

  async start(): Promise<void> {
    await this.connect()
    .then(() => console.info('Products DB is connected'))
    .catch(err => console.error('connection error', err.stack));
    
    await this.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp" 
    `);

    await this.query(`
      create table IF NOT EXISTS product (
      id uuid not null DEFAULT uuid_generate_v4 () PRIMARY KEY,
      title text not null unique,
      description text,
      price integer         
    )`);

    await this.query(`
      create table IF NOT EXISTS stocks (
      product_id uuid,
      count integer,
      foreign key ("product_id") references "product" ("id")
    )`);
 
    await this.end();
  }

      
}

    


