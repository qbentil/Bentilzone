import { Component, OnInit } from '@angular/core';

import { CartModuleServer } from './../../modules/cart.module';
import { CartService } from './../../services/cart.service';
import { ProductModuleServer } from 'src/app/modules/product.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

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



  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total)
    this.cartService.cartData$.subscribe(data => this.cartData = data)
  }

}
