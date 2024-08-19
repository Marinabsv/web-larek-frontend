import './scss/styles.scss';

import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Contacts } from './components/Contacts';
import { LarekApi } from './components/LarekApi';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { IContactForm, IOrderForm, IProduct, OrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppData(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const basket = new Basket(
	cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')),
	events
);
const order = new Order(
	cloneTemplate(ensureElement<HTMLTemplateElement>('#order')),
	events
);
const contacts = new Contacts(
	cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')),
	events
);

//// Получение списка
api
	.getCardList()
	.then(appData.setItems.bind(appData))
	.catch((err) => {
		console.error(err);
	});

//Отображение списка продуктов

events.on('items:change', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

// Открыть карточку продукта
events.on('card:select', (item: IProduct) => {
	appData.setOpenCard(item);
});

events.on('card:open', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.getItems(item)) {
				appData.addCard(item);
				card.button = 'Удалить из корзины';
			} else {
				appData.deleteCard(item);
				card.button = 'В корзину';
			}
		},
	});
	card.button = appData.getItems(item) ? 'Удалить из корзины' : 'В корзину';
	modal.render({ content: card.render(item) });
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Оформить
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Товар в корзине

events.on('basket:change', () => {
	page.counter = appData.basket.items.length;
	basket.items = appData.basket.items.map((id, index) => {
		const item = appData.items.find((item) => item.id === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.deleteCard(item),
		});
		card.index = index + 1;
		return card.render(item);
	});
	basket.total = appData.basket.total;
});

// адресс и оплата

events.on('orderErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join(' и ');
});

events.on(
	/^order\..*:change$/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.setOrder(data.field, data.value);
		appData.validateOrder();
	}
);

// Далее
events.on('order:submit', () => {
	if (appData.validateContacts()) {
		order.valid = true;
	}
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//почта и телефон
events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.setOrder(data.field, data.value);
		appData.validateContacts();
	}
);

events.on('contactsErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(' и ');
});

// Блокировка прокрутки страницы
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

// Отправление формы заказа

events.on('contacts:submit', () => {
	api
		.orderProduct({ ...appData.order, ...appData.basket })
		.then((result) => {
			const success = new Success(
				cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
				{
					onClick: () => {
						modal.close();
						appData.clearBasket();
					},
				}
			);

			modal.render({
				content: success.render(result),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
