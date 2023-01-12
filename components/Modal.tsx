import {useAppDispatch, useAppSelector} from "../state/store";
import {X} from "lucide-react";
import {closeModal} from "../state/features/modal/modalReducer";
import AddToCartModal from "./modals/AddToCartModal";

export default function Modal() {
    const {props} = useAppSelector(state => state.modal)
    if (props == null) return <></>
    return <div
        className="p-4 z-30 w-full h-full bg-black bg-opacity-50 flex items-center justify-center fixed top-0 left-0">
        {props.type === "add-to-cart" && <AddToCartModal item={props.data}/>}
    </div>
}