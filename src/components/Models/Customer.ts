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

    // Адрес: минимальная длина для вменяемости
    const trimmedAddress = (this.address || '').trim();
    if (!trimmedAddress) {
      errors.address = 'Укажите адрес';
    } else if (trimmedAddress.length < 5) {
      errors.address = 'Адрес слишком короткий';
    }

    // Телефон: допускаем форматы с пробелами/скобками/дефисами, проверяем 11 цифр и ведущую 7/8
    const digitsPhone = (this.phone || '').replace(/\D/g, '');
    if (!digitsPhone) {
      errors.phone = 'Укажите телефон';
    } else if (!(digitsPhone.length === 11 && /^(7|8)/.test(digitsPhone))) {
      errors.phone = 'Некорректный телефон';
    }

    // Email: простая проверка формата user@domain.tld
    const trimmedEmail = (this.email || '').trim();
    if (!trimmedEmail) {
      errors.email = 'Укажите email';
    } else if (!/^\S+@\S+\.[\w-]+$/.test(trimmedEmail)) {
      errors.email = 'Некорректный email';
    }

    return errors;
  }
}
