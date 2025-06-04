import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasket {
  busketItems: HTMLElement[], 
  totalPrice: number,
  orderButton: HTMLButtonElement 
}

export class Busket extends Component<IBasket> {
  protected _busketItems: HTMLElement;
  protected _totalPrice: HTMLElement;
  protected _orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container)

    this._busketItems = ensureElement('.basket__list', this.container)
    this._totalPrice = this.container.querySelector('.basket__price')
    this._orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;
  }

  set busketItems(items: HTMLElement[]) {
    this._busketItems.replaceChildren(...items);
  }

  set totalPrice(price: number) {
    this.setText(this._totalPrice, price + ' синапсов')
  }
}