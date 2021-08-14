import { Component, OnInit } from '@angular/core';

import { CartService } from './../../services/cart.service';
import { ProductService } from './../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((prods: any) => {
      this.products = prods.products;
      // console.log(prods.products);
    });
  }

  selectProduct(id: Number)
  {
    this.router.navigate(['/product', id]).then()

  }

  addToCart(id: number)
  {
    this.cartService.addProductToCart(id, 1); // Set initial qty to 1 is not specified.
  }

}
