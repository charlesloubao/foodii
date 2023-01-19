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
    const [placingOrder, setPlacingOrder] = useState<boolean>(false)

    const [address, setAddress] = useState<string>("")
    const [addressError, setAddressError] = useState<string>("")

    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [phoneNumberError, setPhoneNumberError] = useState<string>("")

    const [instructions, setInstructions] = useState<string>("")

    const router = useRouter()

    const cart = useAppSelector(state => state.cart)
    const user = useUser()

    async function onPlaceOrderClick() {
        setPhoneNumberError("")
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
        }
    }

    useEffect(() => {
        console.log({user})
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

                    <h1 className="heading-1 mb-4">Checkout</h1>
                    <div className="border rounded-lg p-4 ">
                        <h2 className="heading-2 mb-6">Delivery details</h2>
                        <TextField value={address} onChange={setAddress} className="mb-2" label={"Address"}
                                   type="text"
                                   name="address" id="address"
                                   placeholder="Address"
                                   error={addressError}/>

                        <TextField value={phoneNumber} onChange={setPhoneNumber} className="mb-4"
                                   label="Phone number"
                                   type="text" name="phone" id="phone"
                                   placeholder="Phone number"
                                   error={phoneNumberError}/>

                        <div>
                            <h3 className="heading-3 mb-2">Delivery instructions</h3>
                            <TextField value={instructions} onChange={setInstructions} multiline={true}
                                       className="resize-none" cols={10} name="instructions"
                                       id="instructions"
                                       placeholder="Anything the driver should know?"/>
                        </div>
                    </div>
                    <Button disabled={placingOrder} onClick={onPlaceOrderClick} className="hidden lg:block mt-4 w-full">
                        {placingOrder
                            ? "Placing your order..."
                            : "Place order"}
                    </Button>


                </div>
            </div>
            <div className="lg:flex-1 p-4 rounded-md border md:border-0 mx-4 md:m-0">
                <h2 className="heading-2 mb-6">Order summary</h2>
                {cart.data!.items.map((item, index) => (
                    <CartListItem key={`cart_item_${index}`} item={item} index={index}/>))}

                <OrderSummaryText cart={cart.data}/>
            </div>
            <div className="p-4 block lg:hidden">
                <Button disabled={placingOrder} onClick={onPlaceOrderClick} className="w-full">
                    {placingOrder
                        ? "Placing your order..."
                        : "Place order"}
                </Button>
            </div>

        </div>


    </div>
}

Checkout.getLayout = function (page: NextPage) {
    return page
}