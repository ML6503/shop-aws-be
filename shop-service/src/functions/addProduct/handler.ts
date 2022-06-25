import { errorServerResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, errorBadRequest } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
// import { Client } from 'pg';
// import { dbOptions } from 'src/service/pgClient';
import ProductService from 'src/service/productService';
import { AddProductRequest }  from './schema';


const addProduct: ValidatedEventAPIGatewayProxyEvent<typeof AddProductRequest> = async (event) => {
  const { title, description, price, count } = event?.body;
  // let addedProduct;
  if(!event.body || !title || !price) {
    return errorBadRequest;
  }
  console.log('Request details from postProductsById: ', event.body);
  try {
    const productService = new ProductService;
   const addedProduct = await productService.addProduct({ title, description, price, count });
   
  // const client = new Client(dbOptions);
  // client.connect(err => {
  //   if (err) {
  //       console.error(err.stack);  
  //       throw Error(`connection error: ${err.stack} `);
  //   } else {
  //     console.log('DB connected')
  //   }
  // });

      
    // try {
       
    //     await client.query('BEGIN')
    //     console.log("BEGIN");
    //     // const queryAddProduct = addProduct(product)
    //     // const res = await this.client.query(queryAddProduct.text, queryAddProduct.value )
    //     const res = await client.query(`INSERT INTO product (title, description, price)
    //                                          VALUES ($1, $2, $3) returning *`, 
    //                                         [`${title}`, `${description}`, price]
    //                                         //VALUES ('${title}', '${description}', ${price}) returning *`,
    //                                         );
    //       const newCreatedProduct = res.rows[0]
    //     console.log('new Just created product - ', newCreatedProduct )
    //     // const queryNewProductStock = addProductStock(newCreatedProduct.id, product.count)
    //     // await this.client.query(queryNewProductStock.text, queryNewProductStock.value)
    //     await client.query('INSERT INTO stocks (product_id, count) VALUES ($1, $2)', [`${newCreatedProduct.id}`, count])
       

    //     // const resultForAddingProduct = await client.query(
        //     `SELECT p.id, s.count, p.price, p.title, p.description
        //     FROM product p
        //     INNER JOIN stocks s ON s.product_id =  p.id WHERE p.id = $1`,
        //     [`${newCreatedProduct.id}`]
        // );
        // addedProduct = resultForAddingProduct.rows[0];
       
        // await client.query('COMMIT');
        
        
        

      // } catch (err) {
      //       // console.error(err.stack);
      //       await client.query('ROLLBACK');
      //       throw err;
      // } finally {
      //   await client.end();
      // } 
  console.log('addedProduct ', addedProduct );
  
  return formatJSONResponse({
    message: `Product with title: ${title} has been added.`,
    product: addedProduct,
  });
   
  } catch (err) {
    console.error(err);
    if(err.statusCode < errorServerResponse.statusCode) {
      return err;
    }
    return errorServerResponse;
  }
};

export const main = middyfy(addProduct);
