export interface IProduct {
	selected: boolean;
	id: string;
	title: string;
	image: string;
	category: string;
	description?: string;
	price: number | null;
	index?: string;
	button?: string;
	buttonDelete?: string;
	buttonInBasket?: string;
}

export interface IBasketModel {
	items: IProduct[];
	getTotal(): number;
	add(id: IProduct): void;
	remove(id: IProduct): void;
	clearBasket(): void;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
	title: string;
	price: number;
}

export interface IOrderForm {
	address: string;
	payment: string;
}

export interface IAppState {
	catalog: IProduct[];
	preview: string | null;
	order: IOrderForm | null;
	contacts: IContactsForm | null;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrderResult {
	id: string;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IModalData {
	content: HTMLElement;
}

export interface IButtonPayment {
	onClick: (tab: string) => void;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IProductItem {
	description: string;
}

export type ICard = IProduct & IProductItem;

export type OpenCard = IProduct;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type FormErrorsContact = Partial<Record<keyof IContactsForm, string>>;

export type CatalogChangeEvent = {
	catalog: IProduct[];
};
