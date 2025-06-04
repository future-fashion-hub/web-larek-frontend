import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { AppApi } from './components/base/AppApi';
import { CatalogModel } from './components/model/CatalogModel';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { Card } from './components/view/Card';
import { cloneTemplate } from './utils/utils';
import { Popup } from './components/view/Popup';
import { Busket } from './components/view/Busket';
import { BusketModel } from './components/model/BusketModel';

const events = new EventEmitter()
const api = new AppApi(API_URL);
const catalog = new CatalogModel(events)
const busket = new BusketModel(events)
const page = new Page(document.querySelector('.page'), events)
const modal = new Popup(document.querySelector('.modal'), events);

const cardTemp = document.querySelector('#card-catalog')
const cardPreviewTemp = document.querySelector('#card-preview') as HTMLTemplateElement;
const busketTemp = document.querySelector('#basket') as HTMLTemplateElement;
const cardInBusketTemp = document.querySelector('#card-basket') as HTMLTemplateElement;


api.getCards()
  .then(cards => {
    catalog.setCatalog(cards.items)
  })
  .catch(err => console.error(err))

events.on('catalog:changed', () => {
  const itemsHTMLArray = catalog.getCatalog().map(item => new Card(cloneTemplate(cardTemp as HTMLTemplateElement), events).render(item))
  page.render({
    catalog: itemsHTMLArray,
    counter: busket.getTotalEmount()
  })
})

events.on('card:open', (data: { id: string }) => {
  const cardById = catalog.getCard(data.id);
  const checkItemInBusket = busket.getItems().some(item => item.id === data.id)
  const cardHTML = new Card(cloneTemplate(cardPreviewTemp as HTMLTemplateElement), events).render({...cardById, buttonDisabled: checkItemInBusket});
  modal.render({
    content: cardHTML,
  })
});

events.on('model:open', () => {
  page.locked = true
})

events.on('model:close', () => {
  page.locked = false
})

events.on('basket:open', () => {
  const cardInBusket = busket.getItems();
  const totalPrice = busket.getTotalPrice();
  const cardBusketListHTML = cardInBusket.map((cardData) => new Card(cloneTemplate(cardInBusketTemp), events).render(cardData))
  const busketHTML = new Busket(cloneTemplate(busketTemp as HTMLTemplateElement), events).render({
    busketItems: cardBusketListHTML,
    totalPrice: totalPrice
  })
  modal.render({
    content: busketHTML
  })
})

events.on('basket:add', (data: { id: string }) => {
  if (!busket.getItems().find(item => item.id === data.id)) {
    const cardById = catalog.getCard(data.id);
    busket.addItems(cardById)
    page.render({
      counter: busket.getTotalEmount()
    })
  } 
})

events.on('basket:remove', (data: { id: string }) => {
  busket.removeItem(data.id)
  page.render({
    counter: busket.getTotalEmount()
  })
})
