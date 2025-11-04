import { FormBase } from './FormBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends FormBase<{ address: string; payment: string }> {
  private readonly buttonsWrap: HTMLElement;
  private readonly paymentButtons: HTMLButtonElement[];

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container, 'form[name="order"]');
    this.buttonsWrap = ensureElement<HTMLElement>('.order__buttons', container);
    this.paymentButtons = Array.from(this.buttonsWrap.querySelectorAll('.button')) as HTMLButtonElement[];

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectPayment(btn.name);
        this.events.emit('payment:select', { payment: btn.name });
        this.events.emit('form:change', { form: this.formEl.name, value: this.getValue() });
      });
    });
  }

  private selectPayment(name: string) {
    this.paymentButtons.forEach((b) => b.classList.toggle('button_alt-active', b.name === name));
    const hidden = ensureElement<HTMLInputElement>('input[name="payment"]', this.formEl);
    hidden.value = name;
  }

  protected getValue(): Record<string, unknown> {
    const address = (this.formEl.elements.namedItem('address') as HTMLInputElement)?.value || '';
    const active = this.paymentButtons.find((b) => b.classList.contains('button_alt-active'));
    return { address, payment: active?.name ?? '' };
  }
}


