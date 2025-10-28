export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash' | '';

// Интерфейс для описания объекта с ошибками валидации.
export interface ValidationErrors {
  [key: string]: string;
}

// Интерфейс для работы с API.
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

// Описывает структуру товара в каталоге магазина.
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Описывает данные покупателя для оформления заказа.
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Тип данных отправляемых на сервер
export interface IOrderRequest extends IBuyer {
  total: number,
   items: string[]
} 

// Тип данных получаемых от сервера
export interface IOrderResponse {
  total: number;
  id: string[];
}
