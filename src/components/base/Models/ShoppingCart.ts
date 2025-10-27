import { IProduct } from '../../../types/index.ts';

export class ShoppingCart {
  private items: IProduct[] = [];

  constructor(items: IProduct[] = []) {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  clear(): void {
    this.items = [];
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
