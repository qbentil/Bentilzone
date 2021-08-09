import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  products: ProductResponseModel[] = [];
  private server_url = environment.SERVER_URL;



  constructor(private http:HttpClient) { }

  getSingleOrder(orderid: number)
  {
    return this.http.get<ProductResponseModel[]>(this.server_url+'/orders/'+orderid).toPromise();
  }

}

interface ProductResponseModel{
  id: number;
  title: string;
  description: string;
  price: number;
  qty: number;
  image: string;
}
