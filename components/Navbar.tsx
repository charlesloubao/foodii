import {Menu, ShoppingCart,} from "lucide-react";
import Link from "next/link";
import CartButton from "./CartButton";
import {useAppSelector} from "../state/store";
import AppLogo from "./AppLogo";

export default function Navbar() {
    return <>
        <div>
            <div className="px-4 py-2 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Menu/>
                    <Link href="/">
                        <AppLogo/>
                    </Link>
                </div>
                <CartButton/>
            </div>
        </div>
    </>
}