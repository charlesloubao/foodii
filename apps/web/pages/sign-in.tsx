import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import {useMemo, useState} from "react";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {getRedirectURL} from "../lib/redirectUtils";
import TextField from "../components/TextField";
import Link from "next/link";
import {useAppDispatch} from "../state/store";
import {onError} from "../state/features/error/errorReducer";

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
    const dispatch = useAppDispatch()
    const [signingIn, setSigningIn] = useState<boolean>(false)

    const router = useRouter()
    const redirectTo = useMemo<string>(() => router.query.redirectTo as string ?? getRedirectURL("/"), [router.query])
    const supabase = useSupabaseClient()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    async function signInWithPassword(e: any) {
        e.preventDefault()
        if (signingIn) return

        setSigningIn(true)

        try {
            const success = await supabase.auth.signInWithPassword({email, password})
                .then(({error}) => {
                    if (error) {
                        throw error
                    }
                    return true
                })

            if (success) {
                router.push(redirectTo)
            }
        } catch (e) {
            dispatch(onError(e))
            setSigningIn(false)
        } finally {
        }
    }

    return <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className={"w-full md:w-1/2 lg:w-1/3 xl:w-1/4 m-4  shadow p-4 bg-white rounded-md"}>
            <div className="text-center mb-4">
                <AppLogo size={32}/>
                <p>Test account: <br/> Email: foodii.test@charlesloubao.com
                    <br/>
                    password: p@$$w0rd
                </p>
            </div>
            <form onSubmit={signInWithPassword} className={"mb-4"}>
                <TextField placeholder={"Email"} value={email} onChange={setEmail} required className={"mb-4"} label={"Email"}
                           type={"email"}/>
                <TextField value={password} onChange={setPassword} className={"mb-4"} required label={"Password"}
                           type={"password"} placeholder={"Password"}/>

                <div>
                    <Button disabled={signingIn}>
                        {signingIn ? <span className={"flex items-center"}>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Please wait...
                    </span> : "Sign in"}
                    </Button>

                    <p className={"mt-4 mb-2"}>Don&apos;t have an account? <Link href={`/sign-up?redirectTo=${redirectTo}`}>Create one instead</Link></p>
                    <p>Forgot your password? <Link href={`/reset-password?redirectTo=${redirectTo}`}>Reset password</Link></p>

                </div>
            </form>
            <p className={"mb-4"}>The test account might be used by other people which may affect your experience so I
                recommend creating one with a
                temporary
                email from <a target={"_blank"} rel={"noreferrer"}
                              href={"https://temp-mail.org/en/"}>https://temp-mail.org/en/</a></p>
            <Link className={"font-semibold underline"} href={"/"}>Return home</Link>
        </div>

    </div>
}

SignIn.getLayout = (page: NextPage) => page