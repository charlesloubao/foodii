import {HTMLProps, PropsWithChildren} from "react";
import Styles from '../styles/Button.module.scss'

const variants = {
    "primary": `${Styles.button} ${Styles.primary}`,
    "secondary": `${Styles.button} ${Styles.secondary}`
}

export type ButtonProps = PropsWithChildren<HTMLProps<HTMLButtonElement | HTMLInputElement>> & {
    variant?: keyof typeof variants
    type?: "button" | "submit"
}

export default function Button(props: ButtonProps) {

    if (props.type === "submit") {
        return <input {...props as any}
                      className={`${variants[props.variant ?? "primary"]} ${Styles.button} ${props.className ?? ''}`}
                      type="submit" value={props.value}/>
    }
    return <button {...props as any}
                   className={`${variants[props.variant ?? "primary"]} ${Styles.button} ${props.className ?? ''}`}>{props.children}</button>
}