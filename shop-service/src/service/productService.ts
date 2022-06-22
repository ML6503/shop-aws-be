 import { IProduct, INewProduct, IProductWzStock } from "src/types/product";
import PGClient from './pgClient';

const SELECT_ALL_PRODUCTS = 'SELECT * FROM product';
const SELECT_ONE_PRODUCT_BY_ID = 'SELECT * FROM product WHERE id = $1';
const SELECT_ONE_PRODUCT_STOCK_BY_ID = 'SELECT count FROM stocks WHERE product_id = $1';
const INSERT_ONE_PRODUCT = 'INSERT INTO product (title, description, price) VALUES ($1, $2, $3)';
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

   private readonly client: PGClient;
   public products: Array<IProduct> | [];

    constructor() {
        this.client = new PGClient();
        this.products = [];
    }

    async getAllProducts(): Promise<IProduct[]> {
       try {
        await this.client
        .query(SELECT_ALL_PRODUCTS)
        .then(res => this.products = res.rows)
        .catch(e => console.error(e.stack)); 
       
        return this.products;

       } catch (err) {
           console.error(err);   
        }
    }

    async getAllProductsWzStock(): Promise<IProductWzStock[]> {
        let productsWzStock: IProductWzStock[] | null;
       try {
        await this.client
        .query(SELECT_ALL_PRODUCTS_JOIN_STOCK)
        .then(res => productsWzStock = res.rows)
        .catch(e => console.error(e.stack)); 
       
       return productsWzStock;
       } catch (err) {
           console.log(err);
       }
    }

    async getProductById(productId: string): Promise<IProductWzStock> {
        let singleProduct: IProduct | null;
        let singleProductStock: number;
        // let singleProductWzStock: IProductWzStock | null;

        try {        
            await this.client
            .query(getOneProduct(productId))
            .then(res => singleProduct = res.rows[0])
            .catch(e => console.error(e.stack));
            
            await this.client
            .query(getOneProductStock(productId))
            .then(res => singleProductStock = res.rows[0])
            .catch(e => console.error(e.stack));
            console.log('product ', {...singleProduct, count: singleProductStock });

            return {...singleProduct, count: singleProductStock };

        } catch (err) {
            console.error(err);
        }
    }

    async addProduct(product: INewProduct): Promise<IProductWzStock | null> {
        let newCreatedProduct: IProduct | null;
        let newCreatedProductStock: number;

      try {
        await this.client
        .query(addProduct(product))
        .then(res => newCreatedProduct = res.rows[0])
        .catch(e => console.error(e.stack));

        await this.client
        // .query(addProductStock(product))
        .query(addProductStock(newCreatedProduct.id, product.count))
        .then(res => newCreatedProductStock = res.rows[0])
        .catch(e => console.error(e.stack));
        const newProduct = await this.getProductById(newCreatedProduct.id);
        console.log('new product ', newProduct );
        return  newProduct;

      } catch (err) {
          console.error(err)
      }
    }

    async deleteProductById(productId: string): Promise<IProduct[]> {        
     try {
        await this.client
        .query(deleteProductAndStock(productId))
        .then(res => console.log('res after deleting ',res))
        .catch(e => console.error(e.stack)); 
    
        this.products = await this.getAllProducts();
        return this.products;
     } catch (err) {
         console.error(err);
     }
    }

    async updateProduct(productId: string, product: Partial<IProductWzStock>): Promise<IProductWzStock> {
     
        const { title, description, price, count } = product;

        if (title) {
            updateProductTitle(productId, title);
        } if (description) {
            updateProductDescr(productId, description);
        } if (price) {
            updateProductPrice(productId, price) ;
        } if (count) {
            updateProductStock(productId, count);
        }
        
        const resultedProduct = await this.getProductById(productId);
       
        return resultedProduct;
    }
}
