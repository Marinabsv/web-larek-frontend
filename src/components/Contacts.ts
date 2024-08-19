import { ensureElement } from '../utils/utils';
import { IContactForm } from './../types/index';
import { EventEmitter } from './base/events';
import { Form } from './common/Form';

export class Contacts extends Form<IContactForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			this.container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			this.container
		);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
