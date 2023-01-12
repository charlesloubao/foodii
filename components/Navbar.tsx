import {Menu, ShoppingCart,} from "lucide-react";
import Link from "next/link";
import CartButton from "./CartButton";
import {useAppSelector} from "../state/store";

export default function Navbar() {
    return <>
        <div>
            <div className="px-4 py-2 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Menu/>
                    <Link href="/" className="font-extrabold text-lg text-green-700 tracking-widest">FOODII</Link>
                </div>
                <CartButton/>
            </div>
        </div>
    </>
}