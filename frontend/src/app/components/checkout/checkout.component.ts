import { Component, OnInit } from '@angular/core';

import { CartModuleServer } from 'src/app/modules/cart.module';
import { CartService } from 'src/app/services/cart.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from './../../services/order.service';
import { ProductModuleServer } from 'src/app/modules/product.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

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


  constructor(public cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  this.cartService.cartData$.subscribe((data:CartModuleServer) => this.cartData = data)
  this.cartService.cartTotal$.subscribe((total:number) => this.cartTotal = total )
  }

  onCheckout()
  {
    this.spinner.show().then(p => {
      this.cartService.checkOutFromCart(1);
    })
  }
}

