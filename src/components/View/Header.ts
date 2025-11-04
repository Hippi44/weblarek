import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { AppEvent } from '../../types';

export class Header extends Component<unknown> {
  private readonly basketButton: HTMLButtonElement;
  private readonly counterEl: HTMLElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
    this.counterEl = ensureElement<HTMLElement>('.header__basket-counter', container);

    this.basketButton.addEventListener('click', () => this.events.emit(AppEvent.BasketOpen));
  }

  setCounter(value: number) {
    this.counterEl.textContent = String(value);
  }

  setDisabled(disabled: boolean) {
    this.basketButton.disabled = disabled;
  }
}


