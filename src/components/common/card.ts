import { IProduct } from '../../types';
import { Component } from '../base/components';
import { EventEmitter } from '../base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card<T> extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _category: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index: HTMLElement;
	protected _buttonDelete?: HTMLElement;
	protected _buttonInBasket?: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter,
		item: IProduct,
		isItemInBasket: boolean,
		actions?: ICardActions
	) {
		super(container);

		this._title = container.querySelector('.card__title');
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector('.card__image');
		this._price = container.querySelector('.card__price');
		this._index = this.container.querySelector('.basket__item-index');
		this._button = container as HTMLButtonElement;
		this._buttonDelete = container.querySelector('.basket__item-delete');
		this._buttonInBasket = this.container.querySelector('.button');
		this._description = container.querySelector('.card__text');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}

		if (this._buttonInBasket != null) {
			if (isItemInBasket) {
				this._buttonInBasket.textContent = 'Удалить из корзины';
				this._buttonInBasket.addEventListener('click', () => {
					this.events.emit('removeFromBasket:change', item);
				});
			} else {
				this._buttonInBasket.textContent = 'В корзину';
				this._buttonInBasket.addEventListener('click', () => {
					this.events.emit('addInBasket:change', item);
				});
			}
		}

		if (this._buttonDelete) {
			this._buttonDelete.addEventListener('click', () => {
				this.events.emit('removeFromBasketInBasket:change', item);
				this._buttonDelete.textContent = null;
			});
		}
	}

	set index(value: string) {
		this.setText(this._index, value);
	}

	get index(): string {
		return this._index.textContent || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | null) {
		const displayText = value === null ? 'Бесценно' : `${value} синапсов`;
		this.setText(this._price, displayText);

		if (value === null) {
			this.setDisabled(this._buttonInBasket, true);
		} else {
			this.setDisabled(this._buttonInBasket, false);
		}
	}

	get price(): number {
		const textContent = this._price.textContent.replace(' синапсов', '');
		return textContent === 'Бесценно' ? 0 : Number(textContent);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description(): string {
		return this._description.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this._category?.classList.add('card__category_soft');
				break;
			case 'другое':
				this._category?.classList.add('card__category_other');
				break;
			case 'хард-скил':
				this._category?.classList.add('card__category_hard');
				break;
			case 'дополнительное':
				this._category?.classList.add('card__category_additional');
				break;
			case 'кнопка':
				this._category?.classList.add('card__category_button');
				break;
			default:
				break;
		}
	}

	get category(): string {
		return this._category.textContent || '';
	}
}
