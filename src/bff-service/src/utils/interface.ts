export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  count: number;
}

export interface ICartItem {
  product: IProduct;
  count: number;
}
