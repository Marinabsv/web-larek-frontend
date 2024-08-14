import { IBasket, IOrder, IProduct, OrderForm } from "../types";

export class AppData {
    items: IProduct[]=[];
    order:IOrder={
        items: [],
        payment:'card',
        email:'',
        phone:'',
        address:'',
        total:0
    };

    basket: IBasket={
        items:[],
        total:0
    };
    preview:IProduct=null;
    formError:Partial<Record<keyof OrderForm, string>>={};
}