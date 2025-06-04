import { ICard } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBaseCard extends ICard {
  buttonDisabled?: boolean;
}

export class Card extends Component<IBaseCard> {
  protected _title?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
  protected _price?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _id?: string;

  constructor(container: HTMLElement, events: IEvents, protected buttonIsDisabled?: boolean) {
    super(container);
    this._title = ensureElement('.card__title', this.container);
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category');
    this._description = this.container.querySelector('.card__text');
    this._price = ensureElement('.card__price', this.container);
    this._button = this.container.querySelector('button') as HTMLButtonElement;

    if (this.container.classList.contains('gallery__item')) {
      this.container.addEventListener('click', () => {
        events.emit('card:open', {id: this._id});
      })
    }

    if (this.container.classList.contains('card_full')) {
       this._button.addEventListener('click', () => {
        if (this._price.textContent !== 'Бесценно') {
          events.emit('basket:add', {id: this._id});
          this.setDisabled(this._button, true)
          this.setText(this._button, 'Уже в корзине')
        }
      })
    }

    if (this.container.classList.contains('basket__item')) {
       this._button.addEventListener('click', () => {
        events.emit('basket:remove', {id: this._id});
        events.emit('basket:open')
      })
    }
  }
  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
    this.setImage(this._image, CDN_URL + value);
  }

  set category(value: string) {
    this.setText(this._category, value);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  set price(value: number | null) {
    if (value == null) {
      this.setText(this._price, 'Бесценно')
      this.setText(this._button, 'Нельзя купить')
      this.setDisabled(this._button, true)
    } else {
      this.setText(this._price, value + ' синапсов')
      this.setDisabled(this._button, false)
    }
  }

  set id(value: string) {
    this._id = value;
  }

  set buttonDisabled(value: boolean) {
    this.setDisabled(this._button, value);
    if (value) {
      this.setText(this._button, 'Уже в корзине')
    }
  }
} 