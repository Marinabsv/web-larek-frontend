//интерфейсы

export interface IProduct {
id: string,
name:string,
price:number | null;
category:string;
image:string,
description:string
}


export interface ICard {

}

export interface IBasket {
items:string[],
total:number
}

export interface IContactForm {

}

export interface IPage {

}

export interface IOrder{
items:string[],
payment:PaymentMethod,
email:string,
phone:string,
address:string,
total:number
}

export interface IOrderResult {
id:string,
total:number;
}

export type PaymentMethod = 'cash' | 'card';
export type OrderForm=Omit<IOrder, 'total'|'items'>;
/*
выводить данные - отображение
модель- вводить и изменять данные


1.спроэк-ть типы в проекта
2. реализовать модели данных, 
3. реализ-ть отображение
4. связать модели с отображнеием
*/