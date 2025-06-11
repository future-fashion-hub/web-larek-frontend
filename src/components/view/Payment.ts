import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Payment extends Form {

    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement
    protected _address: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events)

        this._address = container.querySelector('input[name="address"]') as HTMLInputElement
        this._paymentCard = container.querySelector('button[name="card"]');
        this._paymentCash = container.querySelector('button[name="cash"]')

        this._paymentCard.addEventListener('click', () => {
            this.events.emit('order:change', {
                payment: this._paymentCard.name,
                button: this._paymentCard
            })
        })

        this._paymentCash.addEventListener('click', () => {
            this.events.emit('order:change', {
                payment: this._paymentCash.name,
                button: this._paymentCash

            })
        })

        this._address.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            this.events.emit('address:input', {address: target.value});
            if (!target.value) {
                this.errors = 'Введите адрес доставки'
            } else {
                this.errors = ''
            }
        });
    }

    set address(value: string) {
        this.setText(this._address, value)
    }

    switchPayment(value: HTMLElement) {
        this.resetPayment()
        this.toggleClass(value, 'button_alt-active', true)
    }

    resetPayment() {
        this.toggleClass(this._paymentCard, 'button_alt-active', false);
        this.toggleClass(this._paymentCash, 'button_alt-active', false)
    }

    clearPayment() {
        this._address.value = ''
        this.resetPayment()
        this.valid = false
    }
}