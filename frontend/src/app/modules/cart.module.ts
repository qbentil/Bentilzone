import { ProductModuleServer } from './product.module';

export interface CartModuleServer {
  totalAmount: number;
  data: [{
    product?: ProductModuleServer,
    numInCart: number
  }];
}

export interface CartModulePublic{
  total: number;
  prodData: [{
    id: number,
    incart: number
  }];
}
