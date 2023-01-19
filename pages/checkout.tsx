import {GetServerSideProps, NextPage} from "next";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/router";
import AppLogo from "../components/AppLogo";
import Button from "../components/Button";
import TextField from "../components/TextField";
import {useAppDispatch, useAppSelector} from "../state/store";
import CartListItem from "../components/CartListItem";
import OrderSummaryText from "../components/OrderSummaryText";
import {useEffect, useState} from "react";
import axios from "axios";
import {useSession, useUser} from "@supabase/auth-helpers-react";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import context from "react-redux/src/components/Context";
import {getRedirectURL} from "../lib/redirectUtils";
import {onError} from "../state/features/error/errorReducer";
import {AddressElement, Elements, PaymentElement} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

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
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    const dispatch = useAppDispatch()
    const [placingOrder, setPlacingOrder] = useState<boolean>(false)

    const [address, setAddress] = useState<string>("")
    const [addressError, setAddressError] = useState<string>("")

    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [phoneNumberError, setPhoneNumberError] = useState<string>("")

    const [instructions, setInstructions] = useState<string>("")

    const [paymentIntentSecret, setPaymentIntentSecret] = useState<string | null>(null)

    const router = useRouter()

    const cart = useAppSelector(state => state.cart)
    const user = useUser()

    async function onPlaceOrderClick() {
        /*setPhoneNumberError("")
        setAddressError("")

        let hasErrors = false

        const order: any = {
            address: address.trim(),
            phoneNumber: phoneNumber.trim(),
            instructions: instructions.trim(),
        }

        if (!order.address) {
            setAddressError("Address is required")
            hasErrors = true
        }

        if (!order.phoneNumber) {
            setPhoneNumberError("Phone number required")
            hasErrors = true
        }

        if (hasErrors) {
            return
        }
        setPlacingOrder(true)

        try {
            const {id} = await axios.post("/api/place-order", order)
                .then(response => response.data)

            window.location.replace("/track-order?orderId=" + id)

            setPlacingOrder(false)
        } catch (e) {
            alert("An error occurred")
            setPlacingOrder(false)
        }*/
    }

    async function fetchPaymentIntentSecret() {
        try {

            const {clientSecret} = await axios.post("/api/stripe/payment-intent")
                .then(response => response.data)

            setPaymentIntentSecret(clientSecret)

        } catch (e: any) {
            dispatch(onError(e))
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

    return <div className="w-full h-full flex flex-col">
        <div className="p-4 flex items-center justify-between border-b">
            <button className="flex items-center gap-4 font-bold" onClick={() => router.back()}>
                <ArrowLeft/>
                Return to store
            </button>
            <AppLogo/>
            <div className="hidden lg:block"></div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
            <div className="lg:flex-[2] lg:border-r p-4">
                <div className="lg:w-2/3 xl:w-1/2 mx-auto lg:py-4">
                    {paymentIntentSecret && <>
                        <h1 className="heading-1 mb-4">Checkout</h1>
                        <Elements stripe={stripePromise} options={{
                            clientSecret: paymentIntentSecret
                        }}>
                            <div className="border rounded-lg p-4 mb-4">
                                <h2 className="heading-2 mb-6">Delivery details</h2>
                                <AddressElement options={{mode: "shipping"}}/>

                                <div className="mt-4">
                                    <h3 className="heading-3 mb-2">Delivery instructions</h3>
                                    <TextField value={instructions} onChange={setInstructions} multiline={true}
                                               className="resize-none" cols={10} name="instructions"
                                               id="instructions"
                                               placeholder="Anything the driver should know?"/>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 mb-4">
                                <h2 className="heading-2 mb-6">Payment information</h2>
                                <PaymentElement />
                            </div>

                        </Elements>

                        <Button disabled={placingOrder} onClick={onPlaceOrderClick}
                                className="hidden lg:block mt-4 w-full">
                            {placingOrder
                                ? "Placing your order..."
                                : "Place order"}
                        </Button>
                    </>}


                </div>
            </div>
            <div className="lg:flex-1 p-4 rounded-md border md:border-0 mx-4 md:m-0">
                <h2 className="heading-2 mb-6">Order summary</h2>
                {cart.data!.items.map((item, index) => (
                    <CartListItem key={`cart_item_${index}`} item={item} index={index}/>))}

                <OrderSummaryText cart={cart.data}/>
            </div>
            {paymentIntentSecret && <div className="p-4 block lg:hidden">
                <Button disabled={placingOrder} onClick={onPlaceOrderClick}
                        className="w-full">
                    {placingOrder
                        ? "Placing your order..."
                        : "Place order"}
                </Button>
            </div>}

        </div>


    </div>
}

Checkout.getLayout = function (page: NextPage) {
    return page
}