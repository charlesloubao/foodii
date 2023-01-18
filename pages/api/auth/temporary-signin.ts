import {NextApiHandler} from "next";
import * as jwt from "jsonwebtoken"
import {serialize} from "cookie";
import moment from "moment";
import {v4 as uuidv4} from 'uuid';

const handler: NextApiHandler = async (req, res) => {
    const uid = uuidv4()
    const token = jwt.sign({
        anonymous: true,
        id: uid
    }, process.env.SUPABASE_SERVER_ROLE_KEY!, {
        expiresIn: "1d"
    })
    res.setHeader("Set-Cookie", serialize("authorization", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
        httpOnly: true,
        path: "/api/cart",
        expires: moment().add(1, "days").toDate()
    }))

    res.send({success: true})
}

export default handler