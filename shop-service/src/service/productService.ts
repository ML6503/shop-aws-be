import { v4 as uuidv4 } from 'uuid';
import { IProduct, INewProduct } from "src/types/product";

// to mock time to wait reply from DB
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export default class ProductService {
    private productDB: IProduct[] = [
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            title: 'Custom knife',
            description: 'Cobra movie replica',
            price: 123,
            count: 1
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            title: 'Knife Damascus',
            description: 'Damscus steel VG10',
            price: 230,
            count: 3 
        },
        {
            id: '1b9d6bcd-bafd-4b2d-9b5d-ab8dfbbd4bed',
            title: 'Hunting Knife',
            description: 'Knife made of steel N690',
            price: 80,
            count: 10 
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b8d-ab8dfbbd4bed',
            title: 'War Axe',
            description: 'Double sided axe',
            price: 310,
            count: 1
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b8d-ab8dfbbd4bex',
            title: 'Tanto knife',
            description: 'Japanese style knife',
            price: 500,
            count: 2
        },
        {
            id: '5e9d6bcd-bbfd-4b2d-9b8d-ab8dfbbd4bex',
            title: 'Sword cane',
            description: 'Woden cane with hidden N690 steel blade',
            price: 520,
            count: 1
        },
    ];

    constructor() {}

    async getAllProducts(): Promise<IProduct[]> {
        
        await sleep(1000);
        return this.productDB;
    }

    async getProductById(productId: string): Promise<IProduct> {
        
        await sleep(1000);
        const singleProduct =  this.productDB.filter(p => p.id === productId)[0];
        return singleProduct;
    }

    async addProduct(product: INewProduct): Promise<IProduct[]> {
        
        // await sleep(1000);
        const newProduct : IProduct = {id: uuidv4(), ...product};

        this.productDB.push(newProduct);
        const newProductList = await this.getAllProducts();
        return newProductList;
    }

    async deleteProductById(productId: string): Promise<IProduct[]> {        
     
        this.productDB.filter(p => p.id !== productId);
        const newProductList = await this.getAllProducts();
        return newProductList;
    }

    async updateProduct(productId: string, product: Partial<IProduct>): Promise<IProduct[]> {
        const updatedProduct = await this.getProductById(productId);
        const { title, description, price } = product;
        if(title) {
            updatedProduct.title = title;
        } if(description) {
            updatedProduct.description = description;
        } if (price) {
            updatedProduct.price = price;
        }
        
        this.productDB.map(p => p.id === productId ? p = updatedProduct : p);
        const newProductList = await this.getAllProducts();
        return newProductList;
    }
}
