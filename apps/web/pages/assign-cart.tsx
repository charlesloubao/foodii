import {useEffect} from "react";
import {useUser} from "@supabase/auth-helpers-react";
import axios from "axios";
import {useRouter} from "next/router";
import {NextPage} from "next";

export default function AssignCart() {
    const user = useUser()
    const router = useRouter()
    useEffect(() => {
        if (user == null) return
        axios.post("/api/assign-cart").then(() => {
            router.push("/checkout")
        })
    }, [user])
    return <div>Please wait...</div>
}

AssignCart.getLayout = (page: NextPage) => page
