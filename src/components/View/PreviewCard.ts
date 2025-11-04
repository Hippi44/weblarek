import { CardBase, CardCommonData } from './CardBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { AppEvent } from '../../types';

export class PreviewCard extends CardBase<CardCommonData> {
  private readonly addButton: HTMLButtonElement;
  private inCart = false;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.addButton = ensureElement<HTMLButtonElement>('.card__button', container);
    this.addButton.addEventListener('click', () => {
      const id = (this.container as HTMLElement).dataset.id;
      if (!id) return;
      if (this.inCart) this.events.emit(AppEvent.CardRemove, { id });
      else this.events.emit(AppEvent.CardAdd, { id });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set inCartState(value: boolean) {
    this.inCart = value;
    this.addButton.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }

  set price(value: number | null) {
    super.price = value;
    const unavailable = value === null;
    this.addButton.disabled = unavailable;
    this.addButton.textContent = unavailable
      ? 'Недоступно'
      : (this.inCart ? 'Удалить из корзины' : 'В корзину');
  }
}


