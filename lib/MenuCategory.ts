import {MenuItem} from "./MenuItem";

export type MenuCategory = {
    id: string,
    name: string,
    description: string,
    items: MenuItem[]
}