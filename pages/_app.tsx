import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {withDefaultLayout} from "../layouts/DefaultLayout";
import {Provider} from "react-redux";
import {store} from "../state/store";
import Modal from "../components/Modal";
import axios from "axios";
import {SWRConfig} from "swr";
import CartProvider from "../layouts/CartProvider";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import {createBrowserSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {useState} from "react";

const fetcher = (params: any) => axios.get(params).then(response => response.data)

export default function App({Component, pageProps}: AppProps) {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient())

    const getLayout = (Component as any).getLayout || withDefaultLayout

    return <SessionContextProvider supabaseClient={supabaseClient}
                                   initialSession={pageProps.initialSession}>
        <SWRConfig value={{fetcher}}>
            <Provider store={store}>
                <CartProvider>
                    {getLayout(<Component {...pageProps} />)}
                </CartProvider>
                <Modal/>
            </Provider>
        </SWRConfig>
    </SessionContextProvider>
}
