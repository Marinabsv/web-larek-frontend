export interface IProduct {
	id: string;
	name: string;
	price: number | null;
	category: string;
	image: string;
	description: string;
}

export interface IBasket {
	items: string[];
	total: number;
}

export interface IContactForm {
	email: string;
	phone: string;
}

export interface IOrder {
	items: string[];
	payment: Payment;
	email: string;
	phone: string;
	address: string;
}

export interface IOrderForm {
	address: string;
	payment: string;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type Payment = 'cash' | 'card';
export type OrderForm = Omit<IOrder, 'total' | 'items'>;
export type FormErrors = Partial<Record<keyof IOrder, string>>;
