import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {getRedirectURL} from "../lib/redirectUtils";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient(context)
    const {data: {user}} = await supabase.auth.getUser()

    if (user !== null) {
        return {
            redirect: {
                destination: context.query.redirectTo as string ?? getRedirectURL("/"),
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}
export default function SignIn() {
    const router = useRouter()
    const redirectTo = useMemo<string>(() => router.query.redirectTo as string ?? getRedirectURL("/"), [router.query])
    const supabase = useSupabaseClient()


    console.log({redirectTo})

    function onSignInWithGoogle() {
        supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: redirectTo
            }
        })
    }

    return <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className={"text-center shadow p-4 bg-white rounded-md"}>
            <div className=" mb-4">
                <AppLogo size={32}/>
            </div>
            <Button onClick={onSignInWithGoogle} className="block w-full">Sign in with Google</Button>
        </div>
    </div>
}

SignIn.getLayout = (page: NextPage) => page