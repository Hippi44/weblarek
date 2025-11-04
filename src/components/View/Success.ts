import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
  private readonly totalEl: HTMLElement;
  private readonly closeBtn: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    super(container);
    this.totalEl = ensureElement<HTMLElement>('.order-success__description', container);
    this.closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', container);

    this.closeBtn.addEventListener('click', () => this.events.emit('success:close'));
  }

  set total(value: number) {
    this.totalEl.textContent = `Списано ${value} синапсов`;
  }
}


