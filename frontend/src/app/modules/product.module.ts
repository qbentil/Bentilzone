export interface ProductModuleServer {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  images: string;
  image: string;
}

export interface ServerResponse{
  id: number;
  products: ProductModuleServer[];
}
