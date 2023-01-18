import {Menu, ShoppingCart,} from "lucide-react";
import Link from "next/link";
import CartButton from "./CartButton";
import {useAppSelector} from "../state/store";
import AppLogo from "./AppLogo";
import Button from "./Button";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";

export default function Navbar() {
    const router = useRouter()
    const supabase = useSupabaseClient()
    const user = useUser()
    async function signOut() {
        await supabase.auth.signOut()
        router.push("/")
    }

    return <>
        <div>
            <div className="px-4 py-2 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Menu/>
                    <Link href="/">
                        <AppLogo/>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <CartButton/>
                    {user && <Button onClick={signOut}>Sign out</Button>}
                </div>
            </div>
        </div>
    </>
}