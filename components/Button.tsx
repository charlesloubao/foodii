import {HTMLProps, PropsWithChildren} from "react";

export default function Button(props: PropsWithChildren<HTMLProps<HTMLButtonElement>>) {
    return <button {...props as any}
                   className={`bg-black px-4 py-2 rounded-md text-white ${props.className}`}>{props.children}</button>
}