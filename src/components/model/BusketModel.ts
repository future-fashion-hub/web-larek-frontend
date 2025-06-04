import { ICard } from "../../types";
import { IEvents } from "../base/events";

export class BusketModel {
  items: ICard[] = [];
  total: number;
  
  constructor(events: IEvents) {}

  addItems(card: ICard) {
    this.items.push(card);
  }

  removeItem(cardId: string) {
    this.items = this.items.filter(item => item.id !== cardId);
  }

  getItems(): ICard[] {
    return this.items;
  }

  getTotalPrice(): number {
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }

  clearBusket() {
    this.items = [];
  }

  isEmpty(): boolean {
    return this.items ? false : true;
  }

  getTotalEmount(): number {
    return this.items.length
  }
}