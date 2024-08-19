import {
	FormErrors,
	IBasket,
	IOrder,
	IProduct,
	OrderForm,
	Payment,
} from '../types';
import { IEvents } from './base/events';

export class AppData {
	items: IProduct[] = [];
	order: IOrder = {
		items: [],
		payment: undefined,
		email: '',
		phone: '',
		address: '',
	};
	formErrors: FormErrors = {};
	basket: IBasket = {
		items: [],
		total: 0,
	};
	openCard: IProduct = null;

	constructor(protected events: IEvents) {}

	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit('items:change', this.items);
	}

	getItems(item: IProduct) {
		return this.basket.items.includes(item.id);
	}

	setOpenCard(item: IProduct) {
		this.openCard = item;
		this.events.emit('card:open', this.openCard);
	}

	addCard(item: IProduct) {
		this.basket.items.push(item.id);
		this.basket.total = this.basket.total + item.price;
		this.events.emit('basket:change', this.basket);
	}

	deleteCard(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id !== item.id);
		this.basket.total = this.basket.total + item.price;
		this.events.emit('basket:change', this.basket);
	}


	setPayment(method: Payment) {
		this.order.payment = method;
	}

	setOrder(field: keyof OrderForm, value: string) {
		if (field === 'payment') {
			this.setPayment(value as Payment);
		} else {
			this.order[field] = value;
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Укажите email';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:change', this.basket);
	}
}
