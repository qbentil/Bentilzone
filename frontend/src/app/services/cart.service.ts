import { CartModulePublic, CartModuleServer } from './../modules/cart.module';
import { NavigationExtras, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderRponse } from './../modules/order.module';
import { OrderService } from './order.service';
import { ProductModuleServer } from './../modules/product.module';
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
  };

  // DATA VARIABLE TO STORE CART INFO ON SERVER
  private CartDataServer : CartModuleServer = {
    totalAmount: 0,
    data: [{
      product: undefined,
      numInCart: 0,
    }]
  };


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

            // TODO: CREATE CALCULATE TOTAL FUNCTION HERE
            this.cartDataClient.total = this.CartDataServer.totalAmount;
            localStorage.setItem('cart', JSON.stringify(this.CartDataServer))
          }else{
            // Cart data server has something in it
            this.CartDataServer.data.push({
              numInCart: p.incart,
              product: actualProductInfo
            });
            // TODO: CREATE CALCULATE TOTAL FUNCTION HERE

            this.cartDataClient.total = this.CartDataServer.totalAmount;
            localStorage.setItem('cart', JSON.stringify(this.CartDataServer))
          }

          this.cartData$.next({...this.CartDataServer});
        })
      })

    }

  }

  // ADD PRODUCT TO CART
  addProductToCart(id: number, qty: number)
  {
    this.productService.getSingleProduct(id).subscribe(prod => {
          // 1ST CONDITION: If cart is empty
          if(this.CartDataServer.data[0].product == undefined)
          {
            this.CartDataServer.data[0].product = prod;
            this.CartDataServer.data[0].numInCart =  qty != undefined? qty: 1;
            this.cartDataClient.prodData[0].incart = this.CartDataServer.data[0].numInCart;
            this.cartDataClient.prodData[0].id = prod.id;
            this.cartDataClient.total = this.CartDataServer.totalAmount;

            // update local storage
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            this.cartData$.next({...this.CartDataServer});

            // TODO: DISPLAY A TOAST NOTIFICATION

          }else{
                //2ND CONDITION: If the cart has something
                let index = this.CartDataServer.data.find(p => p.product.id == prod.id) // response will be -1 or positive
                  // a. If item is already in the cart => index is positive value
                  if(index != -1 )
                  {
                    if(qty != undefined && qty <= prod.quantity)
                    {
                      this.CartDataServer.data[index].numInCart = this.CartDataServer.data[index].numInCart < prod.quantity? qty : prod.quantity;
                    }else{
                      this.CartDataServer.data[index].numInCart = this.CartDataServer.data[index].numInCart < prod.quantity?  this.CartDataServer.data[index].numInCart++ : prod.quantity;
                    }
                    this.cartDataClient.prodData[index].incart = this.CartDataServer.data[index].numInCart;
                    // TODO: DISPLAY A TOAST NOTIFICATION

                  }else{
                    this.CartDataServer.data.push({
                      numInCart: 1,
                      product: prod
                    })

                    this.cartDataClient.prodData.push({
                      incart: 1,
                      id: prod.id
                    })

                    // TODO: DISPLAY A TOAST NOTIFICATION
                    // TODO: CALCULATE TOTAL AMOUNT
                    this.calculateTotal();


                    this.cartDataClient.total = this.CartDataServer.totalAmount;
                    // update local storage
                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
                    this.cartData$.next({...this.CartDataServer});
                  } //END OF ELSE


          }
    })

  }

  // UPDATE PRODUCT IN CART
  updateCartItems(index: number, increase: boolean)
  {
    let data = this.CartDataServer.data[index];

    if(increase)
    {
      data.numInCart < data.product.quantity? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.cartDataClient.total = this.CartDataServer.totalAmount;
      //TODO: CALC TOTAL AMOUNT
      this.calculateTotal();


      // update local storage
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
      this.cartData$.next({...this.CartDataServer});  // emitting the object.
    }else{
      data.numInCart--;
      if(data.numInCart < 1)
      {
        // TODO: DELETE PRODUCT FROM CART
        this.deleteProductFromCart(index);

      }else{
        this.cartData$.next({...this.CartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        //TODO: CALC TOTAL AMOUNT
        this.calculateTotal();


        // update local storage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
        this.cartData$.next({...this.CartDataServer});  // emitting the object.
      }
    }
  }

  // DELETE PRODUCT FROM CART
  deleteProductFromCart(index: number)
  {
    if(window.confirm("Are you sure you want to remove this item from your cart?"))
    {
      this.CartDataServer.data.splice(index, 1) // removing product from array
      this.cartDataClient.prodData.splice(index, 1);
      // TODO: CALCULATE TOTAL AMOUNT
      this.calculateTotal();

      this.cartDataClient.total = this.CartDataServer.totalAmount;

      if(this.cartDataClient.total == 0)
      {
        this.resetClientData(); // reset to default
        // update local storage
      }else{
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
      }

      if(this.CartDataServer.totalAmount == 0)
      {
        this.resetServerData()// RESET server data to default
      }else{
        this.cartData$.next({...this.CartDataServer})
      }
    }else{
      // IF USER DO NOT CONFIRM DELETE
      return;
    }
  }

  private calculateTotal()
  {
    let Total = 0;
    this.CartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;

      Total = numInCart * price;
    })

    this.CartDataServer.totalAmount = Total;
    this.cartTotal$.next(this.CartDataServer.totalAmount);
  }

  checkOutFromCart(userid: number)
  {
    this.http.post(`${this.server_url}/orders/payment`, null).subscribe((res: any) =>{
      if(res.success)
      {
        this.resetServerData();
        this.http.post(`${this.server_url}/orders/new`, {
          userId: userid,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderRponse) =>{
          this.orderService.getSingleOrder(data.order_id).then(prods => {

            if(data.success)
            {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  order_id: data.order_id,
                  total: this.cartDataClient.total
                }
              }
              // TODO: HIDE SPINNER
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.resetClientData();
                this.cartTotal$.next(0);
              });
            };
          })
        })
      }
    });
  }

  private resetServerData()
  {
    this.CartDataServer = {
      totalAmount: 0,
      data: [{
          product: undefined,
          numInCart: 0
      }]
    };

    this.cartData$.next({...this.CartDataServer})
  }

  private resetClientData()
  {
    this.cartDataClient = {
      total: 0,
      prodData: [{
        id: 0,
        incart: 0
      }]
    };

    localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
  }
}
