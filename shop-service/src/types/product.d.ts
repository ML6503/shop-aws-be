export  interface IProduct {
    id: string;
    title: string,
    description: string,
    price: number,
    count: number
}

export interface INewProduct {
    title: string,
    description: string,
    price: number,
    count: number
}

export interface IProducts {
    products: IProduct[]
}
