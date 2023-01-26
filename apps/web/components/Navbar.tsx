import {Menu, ShoppingCart,} from "lucide-react";
import Link from "next/link";
import CartButton from "./CartButton";
import {useAppDispatch, useAppSelector} from "../state/store";
import AppLogo from "./AppLogo";
import Button from "./Button";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";
import {useSidebar} from "./Sidebar";
import {getRedirectURL} from "../lib/redirectUtils";

export default function Navbar() {
    const router = useRouter()
    const supabase = useSupabaseClient()
    const user = useUser()

    const {toggleSidebar} = useSidebar()

    async function signOut() {
        await supabase.auth.signOut()
        router.push("/")
    }

    function signIn() {
        router.push(`/sign-in?redirectTo=${getRedirectURL(router.asPath)}`)
    }

    return <>
        <div>
            <div className="px-4 py-2 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => toggleSidebar(true)}><Menu/></button>
                    <Link href="/">
                        <AppLogo/>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <CartButton/>
                    {user ? <Button variant="secondary" onClick={signOut}>Sign out</Button>
                        : <Button variant="primary" onClick={signIn}>Sign in</Button>}
                </div>
            </div>
        </div>
    </>
}