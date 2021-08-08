import { Component, OnInit } from '@angular/core';
import { ProductService } from './../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    // this.productService.getProduct().subscribe((prods: any) => {
    //   this.products = prods.products;
    //   // console.log(prods.products);
    // });
  }
}
