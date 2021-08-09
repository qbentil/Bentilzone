import { CartModulePublic, CartModuleServer } from './../modules/cart.module';

import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderService } from './order.service';
import { ProductModuleServer } from './../modules/product.module';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
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

  // DATA VARIABLE TO STORE CART INFO ON SERVER
  private CartDataServer : CartModuleServer = {
    totalAmount: 0,
    data: [{
      product: undefined,
      numInCart: 0,
    }]
  }


  /*OBSERVABLES FOR COMPONENTS TO SUBSCRIBE */

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModuleServer>(this.CartDataServer);


  constructor(private http:HttpClient,
              private productService:ProductService,
              private orderService: OrderService,
              private router: Router) {

    this.cartTotal$.next(this.CartDataServer.totalAmount);
    this.cartData$.next(this.CartDataServer);

    // Get information form Local storage if any
    let info = JSON.parse(localStorage.getItem('cart') || '{}');

    if(info != undefined && info != null && info.prodData[0].incart != 0)
    {
      // localStorage is not empty
      this.cartDataClient = info;

      // Loop through each entry and put in CartDataServer object

      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModuleServer) =>{
          if(this.CartDataServer.data[0].numInCart == 0)
          {
            // CartDataServer is empty
            this.CartDataServer.data[0].numInCart = p.incart;
            this.CartDataServer.data[0].product = actualProductInfo;

            // TODO: CREATE VALCULATE TOTAL FUNCTION HERE
            this.cartDataClient.total = this.CartDataServer.totalAmount;
            localStorage.setItem('cart', JSON.stringify(this.CartDataServer))
          }else{
            // Cart data server has something in it
            this.CartDataServer.data.push({
              numInCart: p.incart,
              product: actualProductInfo
            });
            // TODO: CREATE VALCULATE TOTAL FUNCTION HERE

            this.cartDataClient.total = this.CartDataServer.totalAmount;
            localStorage.setItem('cart', JSON.stringify(this.CartDataServer))
          }
          
          this.cartData$.next({...this.CartDataServer});
        })
      })

    }

  }

}
