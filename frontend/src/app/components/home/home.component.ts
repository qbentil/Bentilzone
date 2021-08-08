import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) { }

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

}
