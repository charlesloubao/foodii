import {HTMLProps, PropsWithChildren} from "react";

export default function Button(props: PropsWithChildren<HTMLProps<HTMLButtonElement>>) {
    return <button {...props as any}
                   className={`bg-gray-700 disabled:bg-gray-400 hover:bg-gray-800 active:bg-gray-900 px-4 py-2 rounded-md text-white font-semibold ${props.className}`}>{props.children}</button>
}