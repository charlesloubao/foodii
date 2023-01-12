import {NextPage} from "next";
import {useRouter} from "next/router";
import {useMemo} from "react";

export default function TrackOrder() {
    const router = useRouter()
    const orderId = useMemo<string>(() => router.query.orderId as string, [router.query])

    if (orderId == null) {
        return <></>
    }

    return <div className="text-center">
        <div className="md:w-2/3 lg:w-1/2 mx-auto p-4">
            <div className="text-xl font-bold mb-2">
                Order ID: {orderId}
            </div>
            <p className="mb-4">Your order is on it&apos;s way!
                <br/>
                In the mean time watch these two eat</p>
            <img className="inline-block" src="https://i.giphy.com/media/SCIdk5a1BYzxC/giphy.webp" alt=""/>
        </div>
    </div>
}

TrackOrder.getLayout = (page: NextPage) => page