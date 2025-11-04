import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class FormBase<TValue extends object> extends Component<TValue> {
  protected readonly formEl: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsEl: HTMLElement;

  protected constructor(protected readonly events: IEvents, container: HTMLElement, formSelector = 'form') {
    super(container);
    this.formEl = ensureElement<HTMLFormElement>(formSelector, container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', container);

    this.formEl.addEventListener('input', () => {
      this.events.emit('form:change', { form: this.formEl.name, value: this.getValue() });
    });

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('form:submit', { form: this.formEl.name, value: this.getValue() });
    });
  }

  // Сбор текущего значения формы. Конкретные реализации могут переопределить
  protected getValue(): Record<string, unknown> {
    const data = new FormData(this.formEl);
    return Object.fromEntries(data.entries());
  }

  setErrors(message: string) {
    this.errorsEl.textContent = message;
  }

  setValid(valid: boolean) {
    this.submitButton.disabled = !valid;
  }
}


