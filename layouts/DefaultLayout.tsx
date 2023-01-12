import Navbar from "../components/Navbar";
import {PropsWithChildren} from "react";

export default function DefaultLayout({children}: PropsWithChildren<any>) {
    return <div className="w-full h-full flex flex-col">
        <header>
            <Navbar/>
        </header>
        <main className="flex-1">
            {children}
        </main>
    </div>
}

export function withDefaultLayout(page: any) {
    return <DefaultLayout>
        {page}
    </DefaultLayout>
}