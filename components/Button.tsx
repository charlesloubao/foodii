import {HTMLProps, PropsWithChildren} from "react";
import Styles from '../styles/Button.module.scss'

const variants = {
    "primary": `${Styles.button} ${Styles.primary}`,
    "secondary": `${Styles.button} ${Styles.secondary}`
}

export type ButtonProps = PropsWithChildren<HTMLProps<HTMLButtonElement>> & {
    variant?: keyof typeof variants
}

export default function Button(props: ButtonProps) {
    return <button {...props as any}
                   className={`${variants[props.variant ?? "primary"]} ${Styles.button} ${props.className ?? ''}`}>{props.children}</button>
}