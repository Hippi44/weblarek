import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { AppEvent } from '../../types';

export abstract class FormBase<TValue extends object> extends Component<TValue> {
  protected readonly formEl: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsEl: HTMLElement;

  protected constructor(protected readonly events: IEvents, container: HTMLElement, formSelector = 'form') {
    super(container);
    // If the container itself is the form element (common for templates with <form> as root),
    // use it directly; otherwise, search within the container.
    this.formEl = (container.matches && container.matches(formSelector))
      ? (container as HTMLFormElement)
      : ensureElement<HTMLFormElement>(formSelector, container);
    // Query submit and errors within the resolved form element
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.formEl);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.formEl);

    this.formEl.addEventListener('input', () => {
      this.events.emit(AppEvent.FormChange, { form: this.formEl.name, value: this.getValue() });
    });

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(AppEvent.FormSubmit, { form: this.formEl.name, value: this.getValue() });
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


