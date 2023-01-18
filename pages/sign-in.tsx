import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import {useMemo} from "react";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient(context)
    const {data: {user}} = await supabase.auth.getUser()

    if (user !== null) {
        return {
            redirect: {
                destination: context.query.redirectTo as string ?? "/",
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
    const redirectTo = useMemo<string>(() => router.query.redirectTo as string ?? "/", [router.query])
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
            <Button className="block w-full mb-2">Sign in with Email</Button>
            <Button onClick={onSignInWithGoogle} className="block w-full">Sign in with Google</Button>
        </div>
    </div>
}

SignIn.getLayout = (page: NextPage) => page