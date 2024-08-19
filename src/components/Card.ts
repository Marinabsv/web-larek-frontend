import { ensureElement } from '../utils/utils';
import { IProduct } from './../types/index';
import { Component } from './base/components';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLImageElement>('.card__price', container);
		this._description = container.querySelector('.card__description');
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
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

	set price(value: string) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	set index(value: number) {
		if (this._index) {
			this._index.textContent = value.toString();
		}
	}
}
