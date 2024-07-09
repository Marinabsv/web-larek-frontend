import { BasketModel } from './basket';
import { Model } from '../base/model';
import {
	IProduct,
	IAppState,
	IOrderForm,
	IContactsForm,
	FormErrors,
	FormErrorsContact,
	IBasketModel,
} from '../../types';

export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	order: IOrderForm = {
		address: '',
		payment: '',
	};
	contacts: IContactsForm = {
		email: '',
		phone: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};
	formErrorsContact: FormErrorsContact = {};
	basketModel: IBasketModel = new BasketModel();
	selectedItem: IProduct;
	price: IProduct;

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setCardPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setPreview(item: IProduct) {
		this.selectedItem = item;
		this.emitChanges('items:changed', item);
	}

	getTotalPrice() {
		return this.basketModel.getTotal();
	}

	setButton(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	cardInBasket(item: IProduct): boolean {
		return this.basketModel.items.some((it) => it.id === item.id);
	}

	setOrderAddressForm(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrderAddressForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setOrderContactsForm(field: keyof IContactsForm, value: string) {
		this.contacts[field] = value;

		if (this.validateContactsForm()) {
			this.events.emit('order:ready', this.contacts);
		}
	}

	validateOrderAddressForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrorsAddress:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm() {
		const regExpPhone = /(^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$)/;
		const regExpEmail =
			/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

		const errors: typeof this.formErrorsContact = {};
		if (!this.contacts.email || !regExpEmail.test(this.contacts.email)) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.contacts.phone || !regExpPhone.test(this.contacts.phone)) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrorsContact = errors;
		this.events.emit('formErrorsContact:change', this.formErrorsContact);
		return Object.keys(errors).length === 0;
	}
}
