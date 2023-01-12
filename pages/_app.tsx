import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {withDefaultLayout} from "../layouts/DefaultLayout";
import {Provider} from "react-redux";
import {store} from "../state/store";
import Modal from "../components/Modal";

export default function App({Component, pageProps}: AppProps) {
    const getLayout = (Component as any).getLayout || withDefaultLayout

    return <Provider store={store}>
        {getLayout(<Component {...pageProps} />)}
        <Modal/>
    </Provider>
}
