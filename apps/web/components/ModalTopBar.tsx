import {closeModal} from "../state/features/modal/modalReducer";
import {X} from "lucide-react";
import {useAppDispatch} from "../state/store";
import Styles from "../styles/Modal.module.scss"

export default function ModalTopBar({title, closeButton}:{title?: string, closeButton?: boolean}) {
    const dispatch = useAppDispatch()

    return <div className={Styles.topBar}>
        {(closeButton ?? true) && <button onClick={() => dispatch(closeModal())}><X/></button>}
        {title && <span className={"text-lg font-bold"}>{title}</span>}
    </div>
}