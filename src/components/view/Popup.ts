import { ICard, IPopup } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";



export class Popup extends Component<IPopup> {

    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this._closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement
        this._content = ensureElement('.modal__content', this.container)

        this._closeButton.addEventListener('click', () => {
            this.closePopup()
        })

        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') {
                this.closePopup()
            }
        })

        this.container.addEventListener('click', (evt) => {
            if (evt.currentTarget === evt.target) {
                this.closePopup()
            }
        })
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value)
    }

    openPopup() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open')
    }

    closePopup() {
        this.container.classList.remove('modal_active')
        this.content = null
        this.events.emit('modal:close')
    }

    render(data: IPopup): HTMLElement {
        super.render(data);
        this.openPopup()
        return this.container
    }
}