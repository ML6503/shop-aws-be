import { describe, expect, test } from '@jest/globals';
import { getProductsById } from '../src/functions/getProductsById/handler';
import { formatJSONResponse } from '../src/libs/api-gateway';
import ProductService from '../src/service/productService';

describe('function getProductById', () => {
    const productService =  new ProductService;
    test('handler getProductsById returns product by id', async () => {
        const mockid = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
        const event = {
            pathParameters: {
                productId: mockid
            }
        } as any
        const product = await productService.getProductById(mockid);
        const mResponse = formatJSONResponse({
            product: product,    
          });
       
        const actualValue = await getProductsById(event, null, null);
        expect(actualValue).toEqual(mResponse);  
    });

    test('handler getProductsById returns error if wrong id', async () => {
        const event = {
            body: {
                productId: null
            }
        } as any
        
        const mResponse = {
            statusCode: 404,
            body: JSON.stringify({ error: 'Product not found' })
          };
       
        const actualValue = await getProductsById(event, null, null);
        expect(actualValue).toEqual(mResponse);  
    });
});