import { AppEvent, IProduct } from '../../types/index.ts';
import { EventEmitter } from '../base/Events.ts';

export class ProductCatalog {
  private items: IProduct[] = [];
  private selectedCard?: IProduct | null = null;
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit(AppEvent.ItemsChanged, { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | null {
    const item = this.items.find(product => product.id === id);
    return item || null;
  }

  setSelectedCard(card: IProduct): void {
    this.selectedCard = card;
    this.events.emit(AppEvent.CardSelected, { card: this.selectedCard });
  }

  getSelectedCard(): IProduct | null {
    return this.selectedCard || null;
  }
}
