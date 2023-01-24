import {GetServerSideProps, NextPage} from "next";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/router";
import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import TextField from "../components/TextField";
import {useAppDispatch, useAppSelector} from "../state/store";
import CartListItem from "../components/CartListItem";
import OrderSummaryText from "../components/OrderSummaryText";
import {createRef, ReactNode, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useSession, useUser} from "@supabase/auth-helpers-react";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import context from "react-redux/src/components/Context";
import {getRedirectURL} from "../lib/redirectUtils";
import {onError} from "../state/features/error/errorReducer";
import {AddressElement, Elements, ElementsConsumer, PaymentElement} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";

export const getServerSideProps: GetServerSideProps = async (context) => {

    const supabase = createServerSupabaseClient(context)
    const {data: {user}} = await supabase.auth.getUser()

    if (user == null) {
        return {
            redirect: {
                destination: `/sign-in?redirectTo=${getRedirectURL("/checkout")}`,
                permanent: false
            }
        }
    }

    return {
        props: {
            user
        }
    }
}


export default function Checkout() {
    const fetchingPaymentSecret = useRef<boolean>(false)
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    const dispatch = useAppDispatch()

    const [paymentIntentSecret, setPaymentIntentSecret] = useState<string | null>(null)

    const router = useRouter()

    const cart = useAppSelector(state => state.cart)
    const user = useUser()


    async function fetchPaymentIntentSecret() {
        try {
            if (fetchingPaymentSecret.current) return

            fetchingPaymentSecret.current = true
            const {clientSecret} = await axios.post("/api/stripe/payment-intent")
                .then(response => response.data)

            setPaymentIntentSecret(clientSecret)

        } catch (e: any) {
            dispatch(onError(e))
        } finally {
            fetchingPaymentSecret.current = false
        }
    }

    useEffect(() => {
        if (!user) return

        fetchPaymentIntentSecret()

    }, [user])

    if (cart.cartLoading) {
        return <div>Loading...</div>
    } else if (cart.data == null) {
        return <></>
    }

    if (paymentIntentSecret == null) {
        return <></>
    }
    return <>
        <Elements stripe={stripePromise} options={{
            clientSecret: paymentIntentSecret,
        }}>

            <div className="w-full h-full flex flex-col">
                <div className="p-4 flex items-center justify-between border-b">
                    <button className="flex items-center gap-4 font-bold" onClick={() => router.back()}>
                        <ArrowLeft/>
                        Return to store
                    </button>
                    <AppLogo/>
                    <div className="hidden lg:block"></div>
                </div>

                <div className="flex-1 p-4 xl:py-8">
                    <div className={"xl:w-3/5 mx-auto"}>

                        <h1 className="heading-1 mb-8">Checkout</h1>

                        <CheckoutForm/>

                    </div>
                </div>


            </div>

        </Elements>
    </>
}

Checkout.getLayout = function (page: NextPage) {
    return page
}