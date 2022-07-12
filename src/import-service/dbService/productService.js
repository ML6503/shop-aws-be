const { Client } = require('pg');
const { dbOptions } = require('./dbOptions');
const { addProductQuery, addProductStock } = require('./queries');
const {
    UUID,
    CREATE_TABLE_PRODUCT,
    CREATE_TABLE_STOCK,
} = require('./queryText');

class ProductService {
    constructor() {
        this.client = new Client(dbOptions);
        this.productsWithStock = [];
        this.singleProduct;
    }

    connect() {
        this.client.connect((err) => {
            if (err) {
                console.error(err.stack);
                throw Error(`connection error: ${err.stack} `);
            } else {
                console.log('DB connected');
            }
        });
    }

    async createDB() {
        try {
            this.connect();
            await this.client.query(UUID);

            await this.client.query(CREATE_TABLE_PRODUCT);

            await this.client.query(CREATE_TABLE_STOCK);
        } catch (err) {
            console.error(err.stack);
        } finally {
            this.client.end();
        }
    }

    async addProduct(product) {
        try {
            this.connect();
            // this.client.connect((err) => {
            //     if (err) {
            //         console.error(err.stack);
            //         throw Error(`connection error: ${err.stack} `);
            //     } else {
            //         console.log('DB connected');
            //     }
            // });
            await this.client.query('BEGIN');
            console.log('DB INCOMING PRODUCT!!',product );
            const queryAddProduct = addProductQuery(product);
            const res = await this.client.query(
                queryAddProduct.text,
                queryAddProduct.value
            );

            const newCreatedProduct = res.rows[0];

            const queryNewProductStock = addProductStock(
                newCreatedProduct.id,
                product.count
            );
            await this.client.query(
                queryNewProductStock.text,
                queryNewProductStock.value
            );

            const queryGetProduct = getOneProductWzStock(newCreatedProduct.id);
            const resultQueryGetProduct = await this.client.query(
                queryGetProduct.text,
                queryGetProduct.value
            );

            const newProduct = resultQueryGetProduct.rows[0];
            console.log('DB NEW PRODUCT!',newProduct );
            await this.client.query('COMMIT');
            return newProduct;
        } catch (err) {
            await this.client.query('ROLLBACK');
            throw err;
        } finally {
            await this.client.end();
        }
    }
}

module.exports = {
    ProductService
};