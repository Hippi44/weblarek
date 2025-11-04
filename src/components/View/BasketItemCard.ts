import { CardBase, CardCommonData } from './CardBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class BasketItemCard extends CardBase<CardCommonData> {
  private readonly removeButton: HTMLButtonElement;
  private readonly indexEl: HTMLElement | null;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    this.indexEl = container.querySelector('.basket__item-index');

    this.removeButton.addEventListener('click', () => {
      const id = (this.container as HTMLElement).dataset.id;
      if (id) this.events.emit('card:remove', { id });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set index(value: number) {
    if (this.indexEl) this.indexEl.textContent = String(value);
  }
}


