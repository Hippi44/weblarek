import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<unknown> {
  private readonly listEl: HTMLElement;
  private readonly totalEl: HTMLElement;
  private readonly submitButton: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);
    this.listEl = ensureElement<HTMLElement>('.basket__list', container);
    this.totalEl = ensureElement<HTMLElement>('.basket__price', container);
    this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', container);

    this.submitButton.addEventListener('click', () => this.events.emit('basket:order'));
  }

  setItems(items: HTMLElement[]) {
    this.listEl.replaceChildren(...items);
  }

  setTotal(price: number) {
    this.totalEl.textContent = `${price} синапсов`;
  }

  setSubmitDisabled(disabled: boolean) {
    this.submitButton.disabled = disabled;
  }
}


