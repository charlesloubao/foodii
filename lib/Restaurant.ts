import {MenuCategory} from "./MenuCategory";

export type Restaurant = {
    id: string,
    name: string,
    description: string,
    imageURL: string,
    menu: MenuCategory[]
}