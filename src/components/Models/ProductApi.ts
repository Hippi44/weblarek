import {
  IProduct,
  IOrderResponse,
  IOrderRequest,
} from '../../types/index.ts';
import { Api } from '../base/Api.ts';

// Класс API для работы с товарами и заказами на сервере
export class ProductApi {
  // Экземпляр базового API для осуществления запросов
  private api: Api;

  constructor(baseUrl: string) {
    this.api = new Api(baseUrl);
  }

  // Получаем товары с сервера
  getProducts(): Promise<{ items: IProduct[] }> {
    return this.api.get<{ items: IProduct[] }>('/product/');
  }

  // Отправляем заказ на сервер
  postOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', orderData);
  }
}
