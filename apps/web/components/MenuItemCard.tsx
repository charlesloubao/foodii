import {MenuItem} from "../data/MenuItem";
import Styles from '../styles/MenuItemCard.module.scss'
import Button from "./Button";
import {useAppDispatch, useAppSelector} from "../state/store";
import {openModal} from "../state/features/modal/modalReducer";

export type MenuItemCardProps = {
    item: MenuItem
}
export default function MenuItemCard({item}: MenuItemCardProps) {
    const {currentRestaurant, data: cartData} = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()

    function onAddToCart() {
        if (cartData != null && cartData.restaurantId !== currentRestaurant!.id) {
            if (cartData.restaurantId !== currentRestaurant!.id) {
                return dispatch(openModal({
                    type: "ordering-from-other-restaurant-warning",
                    data: item
                }))
            }

            return dispatch(openModal({
                type: "ordering-from-other-restaurant-warning",
                data: item
            }))
        }
        dispatch(openModal({
            type: "add-to-cart",
            data: item
        }))
    }

    return <div
        onClick={onAddToCart}
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