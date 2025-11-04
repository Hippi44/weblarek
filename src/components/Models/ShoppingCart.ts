import { IProduct } from '../../types/index.ts';
import { EventEmitter } from '../base/Events.ts';

export class ShoppingCart {
  private items: IProduct[] = [];
  protected events: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events || new EventEmitter();
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:changed', { items: this.items });
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this.events.emit('cart:changed', { items: this.items });
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed', { items: this.items });
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getTotalItemsCount(): number {
    return this.items.length;
  }

  contains(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}
