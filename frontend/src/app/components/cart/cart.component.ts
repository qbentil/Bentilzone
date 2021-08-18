import { Component, OnInit } from '@angular/core';

import { CartModuleServer } from './../../modules/cart.module';
import { CartService } from './../../services/cart.service';
import { ProductModuleServer } from 'src/app/modules/product.module';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

      // Create an undefined products
      private pro: ProductModuleServer = {
        id: 0,
        name: '',
        price: 0,
        quantity: 0,
        description: '',
        images: '',
        image: ''
      };

      cartData : CartModuleServer = {
        totalAmount: 0,
        data: [{
          product: this.pro,
          numInCart: 0,
        }]
      };
      cartTotal: number = 0;
      subTotal: number = 0;


  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data:CartModuleServer) => this.cartData = data)
    this.cartService.cartTotal$.subscribe((total:number) => this.cartTotal = total )
  }
  public changeQuantity(i: number, inc: boolean)
  {
    this.cartService.updateCartItems(i, inc)
  }

}
