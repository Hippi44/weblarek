import { IBuyer, ValidationErrors } from '../../types/index.ts';
import { EventEmitter } from '../base/Events.ts';

export class Customer {
  payment: IBuyer['payment'] = '';
  address: string = '';
  phone: string = '';
  email: string = '';
  protected events: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events || new EventEmitter();
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;
    this.events.emit('customer:changed', { data: this.getData() });
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('customer:changed', { data: this.getData() });
  }

  validateData(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }

    if (!this.email) {
      errors.email = 'Укажите email';
    }

    return errors;
  }
}
