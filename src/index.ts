import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { AppState } from './components/common/appData';
import { Basket } from './components/common/basket';
import { Card } from './components/common/card';
import { Contacts } from './components/common/contacts';
import { Modal } from './components/common/modal';
import { Order } from './components/common/order';
import { Page } from './components/common/page';
import { WebLarekApi } from './components/common/webLarekApi';
import { Success } from './components/common/success';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { cloneTemplate } from '../src/utils/utils';
import {
	IProduct,
	CatalogChangeEvent,
	IOrderForm,
	IContactsForm,
} from './types';

// Template
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events, {
	onClick: (buttonName) =>
		events.emit('order.payment:change', {
			field: 'payment',
			value: buttonName,
		}),
});
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => events.emit('success:close'),
});

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получение списка

api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

//Отображение списка продуктов

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(
			cloneTemplate(cardCatalogTemplate),
			events,
			item,
			false,
			{
				onClick: () => events.emit('card:select', item),
			}
		);
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Открыть карточку продукта

events.on('card:select', (item: IProduct) => {
	appData.setCardPreview(item);
});

// Открыть корзину

events.on('basket:open', () => {
	modal.render({ content: basket.render() });
});

// Оформить

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Далее

events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Товар в корзине
events.on('basket:change', () => {
	page.counter = appData.basketModel.items.length;
	basket.total = appData.getTotalPrice();
	basket.items = Array.from(appData.basketModel.items).map(
		(basketItem, index) => {
			const item = Array.from(appData.basketModel.items).find(
				(catalogItem) => catalogItem.id === basketItem.id
			);
			const card = new Card(
				cloneTemplate(cardBasketTemplate),
				events,
				item,
				true,
				{
					onClick: () => events.emit('basket:change'),
				}
			);
			return card.render({
				index: String(index + 1),
				title: item.title,
				price: item.price,
			});
		}
	);
});

//Добавление в корзину
events.on('addInBasket:change', (item: IProduct) => {
	appData.basketModel.add(item);
	events.emit('basket:change');

	const cardBasket = new Card(
		cloneTemplate(cardPreviewTemplate),
		events,
		item,
		appData.cardInBasket(item)
	);
	modal.render({ content: cardBasket.render(item) });
});

//Убрать из корзины
events.on('removeFromBasket:change', (item: IProduct) => {
	appData.basketModel.remove(item);
	events.emit('basket:change');
	const cardBasket = new Card(
		cloneTemplate(cardPreviewTemplate),
		events,
		item,
		appData.cardInBasket(item)
	);
	modal.render({ content: cardBasket.render(item) });
});

events.on('removeFromBasketInBasket:change', (item: IProduct) => {
	appData.basketModel.remove(item);
});

// Продукт открыт
events.on('preview:changed', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		const card = new Card(
			cloneTemplate(cardPreviewTemplate),
			events,
			item,
			appData.cardInBasket(item)
		);

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
			}),
		});
	};

	if (item) {
		api
			.getCardItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// Блокируем прокрутку страницы
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

// Валидация

events.on('formErrorsAddress:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrorsContact:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(' и ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderAddressForm(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderContactsForm(data.field, data.value);
	}
);

// Отправление формы заказа

events.on('success:open', () => {
	api
		.orderProduct(appData.order, appData.contacts, appData.basketModel)
		.then(() => {
			success.total = appData.getTotalPrice();
			modal.render({
				content: success.render({}),
			});
			appData.basketModel.clearBasket();
			events.emit('basket:change');
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('success:close', () => {
	modal.close();
});
