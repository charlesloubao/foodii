import {Menu, ShoppingCart,} from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return <div>
        <div className="px-4 py-2 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Menu/>
                <Link href="/" className="font-extrabold text-lg text-green-700 tracking-widest">FOODII</Link>
            </div>
            <div className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full">
                <ShoppingCart/>
                <div className="font-bold">0</div>
            </div>
        </div>
    </div>
}