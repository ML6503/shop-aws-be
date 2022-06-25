import { Client } from 'pg';
import { IProduct, INewProduct, IProductWzStock } from "src/types/product";
import { dbOptions } from './pg-utils';
import { getOneProductWzStock, addProductQuery, addProductStock, deleteProductAndStock, updateProductTitle, updateProductDescr, updateProductPrice, updateProductStock } from './pg-utils/queries';
import { SELECT_ALL_PRODUCTS_JOIN_STOCK } from './pg-utils/queryText';
export default class ProductService {

   private readonly client: Client;
   public productsWithStock: Array<IProductWzStock> | [];
   public singleProduct: IProductWzStock;

    constructor() {
        this.client = new Client(dbOptions);    
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

       async getAllProductsWzStock(): Promise<IProductWzStock[]> {
       
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

            const queryGetProduct = getOneProductWzStock(productId);
            const res = await this.client.query(queryGetProduct.text, queryGetProduct.value);     
            
            this.singleProduct = res.rows[0];    
            return this.singleProduct;
    
        } catch (err) {
            console.error(err.stack);   
        } finally {
            this.client.end();
        }       
    }

    async addProduct(product: INewProduct): Promise<IProductWzStock> {
       
        try {
            this.connect();
            await this.client.query('BEGIN');

            const queryAddProduct = addProductQuery(product);
            const res = await this.client.query(queryAddProduct.text, queryAddProduct.value );
           
            const newCreatedProduct = res.rows[0];
            
            const queryNewProductStock = addProductStock(newCreatedProduct.id, product.count);
            await this.client.query(queryNewProductStock.text, queryNewProductStock.value);
           
            const queryGetProduct = getOneProductWzStock(newCreatedProduct.id);
            const resultQueryGetProduct = await this.client.query(queryGetProduct.text, queryGetProduct.value);     
            
            const newProduct = resultQueryGetProduct.rows[0];
            
            await this.client.query('COMMIT');
            return  newProduct;    
    
          } catch (err) {    
                await this.client.query('ROLLBACK');
                throw err;

          } finally {
            await this.client.end();
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
