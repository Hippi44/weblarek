import { CardBase, CardCommonData } from './CardBase';
import { IEvents } from '../base/Events';

export class CatalogCard extends CardBase<CardCommonData> {
  private readonly rootButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.rootButton = container as HTMLButtonElement;

    this.rootButton.addEventListener('click', () => {
      const id = (this.container as HTMLElement).dataset.id;
      if (id) this.events.emit('card:open', { id });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}


