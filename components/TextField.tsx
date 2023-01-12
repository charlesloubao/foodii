import {HTMLProps, ReactNode} from "react";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export type TextFieldProps =
    Omit<HTMLProps<HTMLInputElement | HTMLTextAreaElement>, "onChange">
    & { error?: ReactNode, label?: ReactNode, multiline?: boolean, onChange?: (value: string) => void }

export default function TextField(props: TextFieldProps) {
    return <div className={props.className}>
        {props.label && <label className="block mb-2 font-semibold" htmlFor={props.name}>{props.label}</label>}

        {props.multiline
            ? <textarea {...props as HTMLProps<HTMLTextAreaElement>}
                        className={"w-full border px-4 py-2 rounded-md"}
                        placeholder={props.placeholder}
                        {...(props.onChange != null ? {
                            onChange: event => props.onChange!(event.target.value)
                        } : {})}
            ></textarea>
            : <input {...props as HTMLProps<HTMLInputElement>}
                     type={props.type}
                     className={"w-full border px-4 py-2 rounded-md"}
                     placeholder={props.placeholder}
                     {...(props.onChange != null ? {
                         onChange: event => props.onChange!(event.target.value)
                     } : {})}
            />}

        {props.error && <div className="text-red-500">{props.error}</div>}

    </div>
}