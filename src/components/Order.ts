import { IOrderForm, Payment } from './../types/index';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrderForm> {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);

		this._buttonCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',
			this.container
		);
		this._buttonCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',
			this.container
		);

		this._buttonCard.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});
		this._buttonCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});

		this._address.addEventListener('click', () => {
			this.onInputChange('address', this._address.value);
		});
	}

	set payment(value: Payment) {
		this.toggleClass(this._buttonCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._buttonCash, 'button_alt-active', value === 'cash');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
