import { CardBase, CardCommonData } from './CardBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class PreviewCard extends CardBase<CardCommonData> {
  private readonly addButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.addButton = ensureElement<HTMLButtonElement>('.card__button', container);

    this.addButton.addEventListener('click', () => {
      const id = (this.container as HTMLElement).dataset.id;
      if (id) this.events.emit('card:add', { id });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}


