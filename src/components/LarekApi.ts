import { IOrder, IOrderResult, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface ILarekApi {
	getCardList: () => Promise<IProduct[]>;
	getCardItem: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<IProduct[]> {
		return this.get('/product/').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCardItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((data: IProduct) => ({
			...data,
			image: this.cdn + data.image,
		}));
	}

	orderProduct(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
