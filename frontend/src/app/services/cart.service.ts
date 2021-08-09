import { CartModulePublic, CartModuleServer } from './../modules/cart.module';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private server_url = environment.SERVER_URL;

  //Data Variable to store cart info on Localstorage
  private cartDataClient: CartModulePublic = {
    total: 0,
    prodData: [{
      id: 0,
      incart: 0
    }]
  }

  // Data variable to store cart info on server
  private CartDataServer : CartModuleServer = {
    totalAmount: 0,
    data: [{
      product: undefined,
      numInCart: 0,
    }]
  }


  /*OBSERVABLES FOR COMPONENTS TO SUBSCRIBE */

  constructor(private http:HttpClient,
              private productService:ProductService,
              private orderService: OrderService) { }

}
