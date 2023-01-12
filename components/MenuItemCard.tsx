import {MenuItem} from "../lib/MenuItem";
import Styles from '../styles/MenuItemCard.module.scss'
import Button from "./Button";

export type MenuItemCardProps = {
    item: MenuItem
}
export default function MenuItemCard({item}: MenuItemCardProps) {
    return <div
        onClick={() => console.log({item})}
        className={Styles.container}
        key={item.id}>
        <div className="flex-1">
            <h4 className={Styles.name}>{item.name}</h4>
            <p className={Styles.description}>{item.description}</p>
            <strong>${item.price}</strong>
        </div>
        <div className={Styles.imageContainer}>
            {item.imageURL != null && <img src={item.imageURL} alt=""/>}
        </div>
        <Button className={Styles.addToOrderButton}>Add</Button>
    </div>
}