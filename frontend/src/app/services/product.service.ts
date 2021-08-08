import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  
  constructor(private http: HttpClient) { }

  /* FETCDH ALL PRODUCTS FROM BACKEND */
  getAllProducts(numberOfResults = 10)
  {
    return this.http.get(this.SERVER_URL+"/products", {
      params:{
        limit: numberOfResults.toString()
      }
    });
  }
}
