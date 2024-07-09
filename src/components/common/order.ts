import { Form } from '..//common/form';
import { EventEmitter } from '../base/events';
import { IOrderForm, IButtonPayment } from '../../types';
import { ensureAllElements } from '../../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _button: HTMLElement;
	protected _payment: HTMLButtonElement[];

	constructor(
		protected container: HTMLFormElement,
		events: EventEmitter,
		actions?: IButtonPayment
	) {
		super(container, events);

		this._button = container.querySelector('.order__button');
		this._payment = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('contacts:open');
			});
		}

		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				actions?.onClick?.(button.name);
				this.selected = button.name;
			});
		});
	}

	set selected(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
