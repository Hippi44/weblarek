import { FormBase } from './FormBase';
import { IEvents } from '../base/Events';

export class ContactsForm extends FormBase<{ email: string; phone: string }> {
  constructor(events: IEvents, container: HTMLElement) {
    super(events, container, 'form[name="contacts"]');
  }
}


