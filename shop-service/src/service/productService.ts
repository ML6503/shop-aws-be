import { Client } from 'pg';
import { IProduct, INewProduct, IProductWzStock } from "src/types/product";
import PGClient, { dbOptions } from './pgClient';

const SELECT_ALL_PRODUCTS = 'SELECT * FROM product';
const SELECT_ONE_PRODUCT_BY_ID = 'SELECT * FROM product WHERE id = $1';
const SELECT_ONE_PRODUCT_STOCK_BY_ID = 'SELECT count FROM stocks WHERE product_id = $1';
const INSERT_ONE_PRODUCT = 'INSERT INTO product (title, description, price) VALUES ($1, $2, $3) RETURNING *';
const INSERT_ONE_PRODUCT_STOCK = 'INSERT INTO stocks (product_id, count) VALUES ($1, $2,)';
// const SELECT_ALL_PRODUCTS_JOIN_STOCK = `SELECT *
//                                         FROM product
//                                         INNER JOIN stocks ON stocks.product_id = product.id order by stocks.count`;
const SELECT_ALL_PRODUCTS_JOIN_STOCK = `SELECT p.id, s.count, p.price, p.title, p.description
                                        FROM product p
                                        INNER JOIN stocks s ON s.product_id = p.id order by s.count DESC`;
const DELETE_ONE_PRODUCT_BY_ID = `DELETE FROM product p
                                  WHERE p.id = $1
                                  AND * IN stocks s
                                  WHERE s.product_id = $1`;

const UPDATE_PRODUCT_TITLE = `UPDATE product SET title = $2 WHERE id = $1`;

const UPDATE_PRODUCT_PRICE = `UPDATE product SET price = $2 WHERE id = $1`;

const UPDATE_PRODUCT_DESCRIPTION = `UPDATE product SET description = $2 WHERE id = $1`;

const UPDATE_PRODUCT_STOCK = `UPDATE stocks SET count = $2 WHERE product_id = $1`;

const SELECT_ONE_PRODUCT_WITH_STOCK_BY_ID = `SELECT p.id, s.count, p.price, p.title, p.description
                                             FROM product p
                                             INNER JOIN stocks s ON s.product_id =  p.id WHERE p.id = $1`;

const SELECT_ONE_PRODUCT = `select * from product where id = $1`;

const deleteProductAndStock =(productId: string) => {
    return {
        text: DELETE_ONE_PRODUCT_BY_ID,
        value: [productId]
    };
};

const getOneProduct = (productId: string) => {
    return {
        text: SELECT_ONE_PRODUCT_BY_ID,
        value: [productId]
    };
};

const getOneProductStock = (productId: string) => {
    return {
        text: SELECT_ONE_PRODUCT_STOCK_BY_ID,
        value: [productId]
    };
};

const getOneProductWzStock = (productId: string) => {
    return {
        text: SELECT_ONE_PRODUCT_WITH_STOCK_BY_ID,
        // text: SELECT_ONE_PRODUCT,
        value: [productId]
    };
};

const addProduct = (product: INewProduct) => {

    const { title, description, price,  } = product;
    return {
        text: INSERT_ONE_PRODUCT,
        value: [ title, description, price ]
    };
};

const addProductStock = (productId: string, count: number) => {

    // const { title, count  } = product;
    return {
        text: INSERT_ONE_PRODUCT_STOCK,
        // value: [ `(select id from product where title = ${title})`, count ]
        value: [ productId, count ]
    };
};

const updateProductTitle = (productId: string, title: string) => {
    return {
        text: UPDATE_PRODUCT_TITLE,
        value: [ productId, title ]
    };
};

const updateProductPrice = (productId: string, price: number) => {
    return {
        text: UPDATE_PRODUCT_PRICE,
        value: [ productId, price ]
    };
};

const updateProductDescr = (productId: string, description: string) => {
    return {
        text: UPDATE_PRODUCT_DESCRIPTION,
        value: [ productId, description ]
    };
};

const updateProductStock = (productId: string, count: number) => {
    return {
        text: UPDATE_PRODUCT_STOCK,
        value: [ productId, count ]
    };
};

export default class ProductService {

   private readonly client: Client;
//    public products: Array<IProduct> | [];
   public productsWithStock: Array<IProductWzStock> | [];
   public singleProduct: IProductWzStock;

    constructor() {
        this.client = new Client(dbOptions);
        // this.client = new PGClient(dbOptions);
        
        // this.products = [];
        this.productsWithStock = [];
        this.singleProduct;
    }

    connect (): void {
        this.client.connect(err => {
            if (err) {
                console.error(err.stack);  
                throw Error(`connection error: ${err.stack} `);
            } else {
              console.log('DB connected')
            }
          });
    }

    // async getAllProducts(): Promise<IProduct[]> {
    //    try {
    //        this.connect();
    //         const res = await this.client.query(SELECT_ALL_PRODUCTS);       
    //         this.products = res.rows;
        
    //         return this.products;

    //    } catch (err) {
    //        console.error(err.stack);   
    //    } finally {
    //         this.client.end();
    //    }
    // }

    async getAllProductsWzStock(): Promise<IProductWzStock[]> {
        // let productsWzStock: IProductWzStock[] | null;
        try {
            this.connect();
             const res = await this.client.query(SELECT_ALL_PRODUCTS_JOIN_STOCK);       
             this.productsWithStock = res.rows;
         
             return this.productsWithStock;
 
        } catch (err) {
            console.error(err.stack);   
        } finally {
             this.client.end();
        }
    }

    async getProductById(productId: string): Promise<IProductWzStock> {    
            
        try {
            this.connect();       
            const res = await this.client.query(`
                SELECT p.id, s.count, p.price, p.title, p.description
                FROM product p
                INNER JOIN stocks s ON s.product_id =  p.id WHERE p.id = '${productId}'`);       
            
            this.singleProduct = res.rows[0];
            
            return this.singleProduct;
    
        } catch (err) {
            console.error(err.stack);   
        } finally {
            this.client.end();
        }       
    }

    async addProduct(product: INewProduct): Promise<IProductWzStock | null> {
        let newCreatedProduct: IProduct | null;
        // let newCreatedProductStock: number;
      try {
        this.connect();
        const queryAddProduct = addProduct(product);
        const res = await this.client.query(queryAddProduct.text, queryAddProduct.value );
        newCreatedProduct = res.rows[0];

        const queryNewProduct = addProductStock(newCreatedProduct.id, product.count);
        await this.client.query(queryNewProduct.text, queryNewProduct.value);
       
        const newProduct = await this.getProductById(newCreatedProduct.id);
        console.log('new product ', newProduct );
        return  newProduct;

      } catch (err) {
            console.error(err.stack);
      } finally {
        this.client.end();
      }
    }

    async deleteProductById(productId: string): Promise<IProduct[]> {        
        try {
            this.connect();
            
            const queryDeleteProduct =  deleteProductAndStock(productId);
            await this.client.query(queryDeleteProduct.text, queryDeleteProduct.value);
    
            this.productsWithStock = await this.getAllProductsWzStock();
            return this.productsWithStock;
        } catch (err) {
            console.error(err.stack);
        } finally {
            this.client.end();
        }
    }

    async updateProduct(productId: string, product: Partial<IProductWzStock>): Promise<IProductWzStock> {     
        const { title, description, price, count } = product;  
        try {
            this.connect();
        if (title) {
            const queryUpdateProductTitle = updateProductTitle(productId, title)
            await this.client.query( queryUpdateProductTitle.text, queryUpdateProductTitle.value);

        } if (description) {
            const queryUpdateProductDescr = updateProductDescr(productId, description);
            await this.client.query( queryUpdateProductDescr.text, queryUpdateProductDescr.value);

        } if (price) {            
            const queryUpdateProductPrice = updateProductPrice(productId, price);
            await this.client.query( queryUpdateProductPrice.text, queryUpdateProductPrice.value);

        } if (count) {  

            const queryUpdateProductStock = updateProductStock(productId, count);
            await this.client.query(queryUpdateProductStock.text, queryUpdateProductStock.value);
        }
        
        const resultedProduct = await this.getProductById(productId);
       
        return resultedProduct;

        } catch (err) {
            console.error(err.stack);

        } finally {
            this.client.end();
        }
    }
}
