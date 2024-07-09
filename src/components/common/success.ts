import { Component } from '../base/components';
import { ensureElement } from '../../utils/utils';

export interface ISuccess {
	total: number;
}

export interface ISuccessAction {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(
		blockName: string,
		container: HTMLElement,
		actions: ISuccessAction
	) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__close`,
			container
		);
		this._description = ensureElement<HTMLElement>(
			`.${blockName}__description`,
			container
		);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		const displayText = `Списано ${value} синапсов`;
		this.setText(this._description, displayText);
	}
}
