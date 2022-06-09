import IProduct from "src/models/Product";

// to mock time to wait reply from DB
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class ProductService {
    private productDB: IProduct[] = [
        {
            productId: '1',
            title: 'Dagger',
            description: 'Cobra movie replica',
            price: 123
        },
        {
            productId: '2',
            title: 'Knife Damascus',
            description: 'Darken damscacus steel',
            price: 230 
        }
    ];

    constructor() {}

    async getAllProducts(): Promise<IProduct[]> {
        
        await sleep(1000);
        return this.productDB;
    }

    async getProductById(productId: string): Promise<IProduct> {
        
        await sleep(1000);
        const singleProduct =  this.productDB.filter(p => p.productId === productId)[0];
        return singleProduct;
    }

    async addProduct(product: IProduct): Promise<IProduct[]> {
        
        // await sleep(1000);
        this.productDB.push(product);
        const newProductList = await this.getAllProducts();
        return newProductList;
    }

    async deleteProductById(productId: string): Promise<IProduct[]> {
        
        // await sleep(1000);
        this.productDB.filter(p => p.productId !== productId);
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
        // await sleep(1000);
        this.productDB.map(p => p.productId === productId ? p = updatedProduct : p);
        const newProductList = await this.getAllProducts();
        return newProductList;
    }
}
