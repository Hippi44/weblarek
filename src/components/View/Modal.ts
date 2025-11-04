import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal {
  private readonly root: HTMLElement;
  private readonly content: HTMLElement;
  private readonly closeBtn: HTMLButtonElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    this.root = container;
    this.content = ensureElement<HTMLElement>('.modal__content', container);
    this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container);

    this.closeBtn.addEventListener('click', () => this.close());
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });
  }

  open(content: HTMLElement) {
    this.setContent(content);
    this.root.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.root.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  setContent(content: HTMLElement) {
    this.content.replaceChildren(content);
  }
}


