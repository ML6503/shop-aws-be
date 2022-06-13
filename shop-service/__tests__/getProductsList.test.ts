import { getProductsList } from '../src/functions/getProductsList/handler';
import { expect, test } from '@jest/globals';

import ProductService from '../src/service/productService';

test('handler getProductList returns products', async () => {
    const productService =  new ProductService;
    const products = await productService.getAllProducts();
    const mResponse = {
        "statusCode": 200,       
        "body": JSON.stringify({"products": products}),
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": "*",
        },
    };
   
    const actualValue = await getProductsList();
    expect(actualValue).toMatchObject(mResponse);  

});