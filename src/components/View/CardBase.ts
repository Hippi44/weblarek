import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

export type CardCommonData = Pick<
  IProduct,
  'id' | 'title' | 'image' | 'price' | 'category'
>;

export abstract class CardBase<TData extends CardCommonData> extends Component<TData> {
  protected readonly titleEl: HTMLElement;
  protected readonly imageEl: HTMLImageElement | null;
  protected readonly priceEl: HTMLElement | null;
  protected readonly categoryEl: HTMLElement | null;

  protected constructor(
    protected readonly events: IEvents,
    container: HTMLElement
  ) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>('.card__title', container);
    this.imageEl = container.querySelector('.card__image');
    this.priceEl = container.querySelector('.card__price');
    this.categoryEl = container.querySelector('.card__category');
  }

  set title(value: string) {
    if (this.titleEl) this.titleEl.textContent = value;
  }

  set image(value: string) {
    if (this.imageEl) this.setImage(this.imageEl, `${CDN_URL}/${value}`, this.titleEl?.textContent || '');
  }

  set price(value: number | null) {
    if (this.priceEl) this.priceEl.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }

  set category(value: string) {
    if (this.categoryEl) {
      this.categoryEl.textContent = value;
      // reset known modifiers
      Object.values(categoryMap).forEach((cls) => this.categoryEl!.classList.remove(cls));
      const mod = categoryMap[value as keyof typeof categoryMap];
      if (mod) this.categoryEl.classList.add(mod);
    }
  }

  setDisabled(disabled: boolean) {
    (this.container as HTMLButtonElement).disabled = disabled;
  }
}


