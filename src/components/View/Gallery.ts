import { Component } from '../base/Component';

export class Gallery extends Component<unknown> {
  constructor(container: HTMLElement) {
    super(container);
  }

  setCatalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }

  clear() {
    this.container.replaceChildren();
  }
}


