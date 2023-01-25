import {ReactNode} from "react";

export function SidebarItem({selected, icon, label}: { selected?: boolean, icon?: ReactNode, label: ReactNode }) {
    return <span className={`transition-all flex items-center gap-4 ${selected ? 'font-semibold bg-gray-100' : ''} hover:bg-gray-200 p-4`}>
        {icon && icon} {label}
    </span>
}
