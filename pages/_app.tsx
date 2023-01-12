import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import {withDefaultLayout} from "../layouts/DefaultLayout";

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = (Component as any).getLayout || withDefaultLayout
  return getLayout(<Component {...pageProps} />)
}
