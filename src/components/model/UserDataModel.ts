import { IForm } from '../../types';
import { IEvents } from "../base/events";

export class UserDataModel {
  protected orderData: IForm = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };

  constructor(protected events: IEvents) {}

  setOrderData(data: Partial<IForm>) {
    Object.assign(this.orderData, data);
  }

  getOrderData(): IForm {
    return this.orderData;
  }

  resetOrder() {
    this.orderData = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: []
    };
  }

  validate(fields: (keyof IForm)[]): boolean {
    return fields.every(field => !!this.orderData[field]);
  }

}