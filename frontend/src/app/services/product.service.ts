import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Server } from 'http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductModuleServer, ServerResponse } from '../modules/product.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  /* FETCH ALL PRODUCTS FROM BACKEND */
  getAllProducts(numberOfResults = 10) : Observable<ServerResponse>
  {
    return this.http.get<ServerResponse>(this.SERVER_URL+"/products", {
      params:{
        limit: numberOfResults.toString()
      }
    });
  }
  /* FETCH SINGLE PRODUCTS FROM BACKEND */
  getSingleProduct(id : Number) : Observable <ProductModuleServer>
  {

    return this.http.get<ProductModuleServer>(this.SERVER_URL+"/products/"+ id);
  }
  /* FETCH SINGLE PRODUCTS FROM BACKEND */
  getProductFromOneCategory(id : Number) : Observable <ProductModuleServer>
  {
    return this.http.get<ProductModuleServer>(this.SERVER_URL+"/products/"+ id);
  }
}
