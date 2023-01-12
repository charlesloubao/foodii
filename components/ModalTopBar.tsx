import {closeModal} from "../state/features/modal/modalReducer";
import {X} from "lucide-react";
import {useAppDispatch} from "../state/store";
import Styles from "../styles/Modal.module.scss"

export default function ModalTopBar() {
    const dispatch = useAppDispatch()

    return <div className={Styles.topBar}>
        <button onClick={() => dispatch(closeModal())}><X/></button>
    </div>
}