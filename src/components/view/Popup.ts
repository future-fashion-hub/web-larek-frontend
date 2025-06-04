import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPopup {
  closeButton?: HTMLButtonElement,
  content: HTMLElement
}

export class Popup extends Component<IPopup> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    console.log(container)
    this._closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
    this._content = ensureElement('.modal__content', this.container);

    this._closeButton.addEventListener('click', () => {
      this.closePopup();
    })
    
    document.addEventListener('keydown', (evt) => {
      if (evt.key == 'Escape') {
        this.closePopup();
      }
    })

    container.addEventListener('click', (evt) => {
      if (evt.currentTarget === evt.target) {
        this.closePopup();
      }
    })

  }

  closePopup() {
    this.container.classList.remove('modal_active')
    this.events.emit('model:close')
  }

  openPopup() {
    this.container.classList.add('modal_active')
    this.events.emit('model:open')
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value)
  }

  render(data: IPopup): HTMLElement {
    super.render(data)
    this.openPopup()
    return this.container
  }
}