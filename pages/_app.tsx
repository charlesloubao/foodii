import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {withDefaultLayout} from "../layouts/DefaultLayout";
import {Provider} from "react-redux";
import {store} from "../state/store";
import Modal from "../components/Modal";
import axios from "axios";
import {SWRConfig} from "swr";
import CartProvider from "../layouts/CartProvider";

const fetcher = (params: any) => axios.get(params).then(response => response.data)

export default function App({Component, pageProps}: AppProps) {
    const getLayout = (Component as any).getLayout || withDefaultLayout

    return <SWRConfig value={{fetcher}}>
        <Provider store={store}>
            <CartProvider>
                {getLayout(<Component {...pageProps} />)}
            </CartProvider>
            <Modal/>
        </Provider>
    </SWRConfig>
}
