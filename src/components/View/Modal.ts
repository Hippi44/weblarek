import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { AppEvent } from '../../types';

export class Modal {
  private readonly root: HTMLElement;
  private readonly content: HTMLElement;
  private readonly closeBtn: HTMLButtonElement;
  private readonly pageWrapper: HTMLElement;

  constructor(private readonly events: IEvents, container: HTMLElement) {
    this.root = container;
    this.content = ensureElement<HTMLElement>('.modal__content', container);
    this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container);
    this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

    this.closeBtn.addEventListener('click', () => this.close());
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });
  }

  open(content: HTMLElement) {
    this.setContent(content);
    this.root.classList.add('modal_active');
    this.pageWrapper.classList.add('page__wrapper_locked');
    this.events.emit(AppEvent.ModalOpen);
  }

  close() {
    this.root.classList.remove('modal_active');
    this.pageWrapper.classList.remove('page__wrapper_locked');
    this.events.emit(AppEvent.ModalClose);
  }

  setContent(content: HTMLElement) {
    this.content.replaceChildren(content);
  }
}


