import React, {
    createContext,
    createRef,
    FocusEventHandler,
    PropsWithChildren,
    useContext,
    useEffect,
    useState
} from "react";
import {useUser} from "@supabase/auth-helpers-react";
import {ChevronLeft, ChevronRight, ChevronsLeft, ConciergeBell, User as UserIcon, Utensils} from "lucide-react";
import Link from "next/link";

export type SidebarState = {
    toggleSidebar: (visible: boolean) => void
    showContent: boolean
    showBackground: boolean
    showSidebar: boolean
}

const SidebarContext = createContext<SidebarState>({} as any)

export function SidebarProvider({children}: PropsWithChildren) {
    const [showContent, setShowContent] = useState<boolean>(false)
    const [showBackground, setShowBackground] = useState<boolean>(false)
    const [showSidebar, setShowSidebar] = useState<boolean>(false)

    function toggleSidebar(visible: boolean) {
        if (visible) {
            setShowSidebar(true)
            setTimeout(() => {
                setShowBackground(true)
                setShowContent(true)
            }, 10)
        } else {
            setShowContent(false)
            setTimeout(() => setShowBackground(false), 0)
            setTimeout(() => setShowSidebar(false), 300)
        }
    }


    return <SidebarContext.Provider value={{showSidebar, showContent, showBackground, toggleSidebar}}>
        {children}
    </SidebarContext.Provider>
}

export function useSidebar() {
    return useContext(SidebarContext)
}

export default function Sidebar() {
    const {showBackground, showSidebar, toggleSidebar, showContent} = useSidebar()

    const sidebarContent = createRef<HTMLDivElement>()

    useEffect(() => {
        if (showSidebar) {
            sidebarContent.current!.focus()
        }
    }, [showSidebar])

    function onSidebarFocusLost(event: React.FocusEvent) {
        const target = event.relatedTarget

        console.log({target})

        if (target == null) {
            return sidebarContent.current!.focus({})
        }

        const isChildOfSidebar = target.closest("[data-sidebar-container]") != null
        const isClickable = target.getAttribute("onclick") != null || target.getAttribute("href") != null

        if (!isChildOfSidebar || isClickable) {
            toggleSidebar(false)
        }
    }

    return <div
        className={`transition-all duration-300 z-20 w-full h-full fixed top-0 left-0 bg-black ${showBackground ? 'bg-opacity-50' : 'bg-opacity-0'} ${showSidebar ? '' : 'hidden'}`}>
        <div
            data-sidebar-container={true}
            onBlur={onSidebarFocusLost}
            ref={sidebarContent}
            tabIndex={0}
            className={`transition-all duration-300 w-5/6 md:w-1/3 lg:w-1/4 xl:w-1/5 h-full bg-white fixed top-0 ${showContent ? "left-0" : "-left-full"}`}>
            <div className="mb-4 p-4 flex items-center border-b justify-between">
                <div className={"font-semibold"}>
                </div>
                <button onClick={() => toggleSidebar(false)}><ChevronsLeft/></button>
            </div>
            <div>
                <Link href={"#"} className={"transition-all flex items-center gap-4 hover:bg-gray-100 p-4"}>
                    <Utensils/>
                    Restaurants
                </Link>
                <Link href={"#"} className={"transition-all flex items-center gap-4 hover:bg-gray-100 p-4"}>
                    <ConciergeBell/>
                    My orders
                </Link>
                <Link href={"#"} className={"transition-all flex items-center gap-4 hover:bg-gray-100 p-4"}>
                    <UserIcon/>
                    My account
                </Link>
            </div>
        </div>
    </div>
}