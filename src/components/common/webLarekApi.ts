import { Api, ApiListResponse } from '../base/api';
import {
	IOrderResult,
	IOrderForm,
	IContactsForm,
	ICard,
	OpenCard,
} from '../../types/index';
import { BasketModel } from './basket';

export interface IWebLarekApi {
	getCardList: () => Promise<ICard[]>;
	getCardItem: (id: string) => Promise<ICard>;
	getOpenCard: (id: string) => Promise<OpenCard>;
	orderProduct: (
		order: IOrderForm,
		contacts: IContactsForm,
		basketModel: BasketModel
	) => Promise<IOrderResult>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCardItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			description: item.description,
		}));
	}

	getOpenCard(id: string): Promise<OpenCard> {
		return this.get(`/product/${id}`).then((data: OpenCard) => data);
	}

	orderProduct(
		order: IOrderForm,
		contacts: IContactsForm,
		basketModel: BasketModel
	): Promise<IOrderResult> {
		return this.post('/order', {
			payment: order.payment,
			email: contacts.email,
			phone: contacts.phone,
			address: order.address,
			total: basketModel.getTotal(),
			items: basketModel.items.map((it) => it.id),
		}).then((data: IOrderResult) => data);
	}
}
