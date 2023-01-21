import TextField from "./TextField";
import {AddressElement, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import CartListItem from "./CartListItem";
import OrderSummaryText from "./OrderSummaryText";
import Button from "./Button";
import {useState} from "react";
import {getRedirectURL} from "../lib/redirectUtils";
import {useAppDispatch, useAppSelector} from "../state/store";
import {onError} from "../state/features/error/errorReducer";
import axios from "axios";

export default function CheckoutForm() {
    const cart = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()

    const stripe = useStripe()!
    const elements = useElements()!

    const [placingOrder, setPlacingOrder] = useState<boolean>(false)

    const [address, setAddress] = useState<string>("")
    const [addressError, setAddressError] = useState<string>("")

    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [phoneNumberError, setPhoneNumberError] = useState<string>("")

    const [instructions, setInstructions] = useState<string>("")

    async function onPlaceOrderClick() {
        setPlacingOrder(true)

        await axios.put("/api/stripe/payment-intent", {
            instructions
        })

        const {error} = await stripe?.confirmPayment({
            elements,
            confirmParams: {
                return_url: getRedirectURL(`/confirm-payment-callback`)
            }
        })

        if (error) {
            dispatch(onError(error))
            setPlacingOrder(false)
        }
    }

    return <div className={"grid lg:grid-cols-2 gap-4 items-start justify-center "}>
        <div>


            <div className="border rounded-lg p-4 mb-4">
                <h2 className="heading-2 mb-6">Delivery details</h2>
                <AddressElement className={"mb-2"} options={{
                    mode: "shipping",
                    fields: {
                        phone: "always"
                    }
                }}/>

                <div>
                    <TextField label={"Delivery instructions"} value={instructions}
                               onChange={setInstructions} multiline={true}
                               className="resize-none" cols={10} name="instructions"
                               id="instructions"
                               placeholder="Anything the driver should know?"/>
                </div>
            </div>

            <div className="border rounded-lg p-4">
                <h2 className="heading-2 mb-6">Payment information</h2>
                <PaymentElement/>
            </div>

        </div>
        <div className="border rounded-md p-4 ">
            <h2 className="heading-2 mb-2">Order summary</h2>
            <h2 className="heading-3 mb-8">{cart.data!.restaurant.name}</h2>
            {cart.data!.items.map((item, index) => (
                <CartListItem key={`cart_item_${index}`} item={item} index={index}/>))}

            <OrderSummaryText cart={cart.data!}/>
        </div>
        <Button disabled={placingOrder} onClick={onPlaceOrderClick}
                className="block w-full">
            {placingOrder
                ? "Placing your order..."
                : "Place order"}
        </Button>
    </div>
}