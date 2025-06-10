import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { AppApi } from './components/base/AppApi';
import { CatalogModel } from './components/model/CatalogModel';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { Card } from './components/view/Card';
import { cloneTemplate } from './utils/utils';
import { Popup } from './components/view/Popup';
import { Basket } from './components/view/Busket';
import { BasketModel } from './components/model/BusketModel';
import { Payment } from './components/view/Payment';
import { UserDataModel } from './components/model/UserDataModel';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';
import { TPaymentMethod } from './types';

const events = new EventEmitter();
const api = new AppApi(API_URL);

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const user = new UserDataModel(events);

const modal = new Popup(document.querySelector('.modal'), events);
const page = new Page(document.querySelector('.page'), events);


const cardTemp = document.querySelector('#card-catalog') as HTMLTemplateElement
const cardPreviewTemp = document.querySelector('#card-preview') as HTMLTemplateElement
const basketTemp = document.querySelector('#basket') as HTMLTemplateElement
const cardInBasketTemp = document.querySelector('#card-basket') as HTMLTemplateElement
const orderTemp = document.querySelector('#order') as HTMLTemplateElement
const contactsTemp = document.querySelector('#contacts') as HTMLTemplateElement
const successTemp = document.querySelector('#success') as HTMLTemplateElement


const orderPayment = new Payment(cloneTemplate(orderTemp), events)
const orderContacts = new Contacts(cloneTemplate(contactsTemp), events)
const orderSuccess = new Success(cloneTemplate(successTemp), events)


api.getCards()
  .then(cards => {
    catalog.setCatalog(cards.items)
  })
  .catch(err => console.error(err))

events.on('catalog:changed', () => {
  const itemsHTMLArray = catalog.getCatalog().map(item => new Card(cloneTemplate(cardTemp), events).render(item))
  page.render({
    catalog: itemsHTMLArray,
    counter: basket.getTotalEmount()
  })
})

events.on('card:open', (data: { id: string }) => {
  const cardById = catalog.getCard(data.id);
  const checkItemInBasket = basket.getItems().some(item => item.id === data.id)
  const cardHTML = new Card(cloneTemplate(cardPreviewTemp as HTMLTemplateElement), events).render({
    ...cardById,
    buttonDisabled: checkItemInBasket || cardById.price === null});
  modal.render({
    content: cardHTML,
  })
});

events.on('modal:open', () => {
  page.locked = true
})

events.on('modal:close', () => {
  page.locked = false
})

events.on('basket:open', () => {
  const cardInBasket = basket.getItems()
  const totalPrice = basket.getTotalPrice()
  const cardBasketListHTML = cardInBasket.map(item => new Card(cloneTemplate(cardInBasketTemp), events).render(item))
  const busketHTML = new Basket(cloneTemplate(basketTemp), events).render({
    basketItems: cardBasketListHTML,
    totalPrice: totalPrice
  })
  user.setOrderData({total: totalPrice, items: basket.getItemsId()})
  modal.render({
    content: busketHTML
  })
});

events.on('basket:add', (data: {id: string}) => {
  if (!basket.getItems().find(item => item.id === data.id)) {
    const cardById = catalog.getCard(data.id);
    basket.addItems(cardById)
    page.render({
      counter: basket.getTotalEmount()
    })
  } 
})

events.on('basket:remove', (data: {id: string}) => {
  basket.removeItem(data.id)
  page.render({
    counter: basket.getTotalEmount()
  })
})

events.on('order:start', () => { 
  modal.render({
    content: orderPayment.render()
  })
})

events.on('address:input', (data: { address: string}) => {
  user.setOrderData({address: data.address})
  orderPayment.valid = user.validate(['address', 'payment'])
});

events.on('order:change', (data: {payment: TPaymentMethod, button: HTMLElement}) => {
  orderPayment.switchPayment(data.button)
  user.setOrderData({payment: data.payment})
  orderPayment.valid = user.validate(['address', 'payment'])
})

events.on('order:submit', () => {
  modal.render({
    content: orderContacts.render()
  })
})

events.on('email:input', (data: {email: string}) => {
  user.setOrderData({email: data.email})
  orderContacts.valid = user.validate(['email', 'phone'])
})

events.on('phone:input', (data: {phone: string}) => {
  user.setOrderData({phone: data.phone})
  orderContacts.valid = user.validate(['email', 'phone'])
})

events.on('contacts:submit', () => {
  const totalPrice = basket.getTotalPrice();
  orderSuccess.total = totalPrice; 

  modal.render({
      content: orderSuccess.render() 
  });

  basket.clearBasket();
  page.render({ counter: 0 }); 

  api.sendOrder(user.getOrderData())
    .then(() => user.resetOrder())
})

events.on('success:submit', () => {
  modal.closePopup()
})