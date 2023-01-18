import {CookieSerializeOptions, serialize} from "cookie";

export function serializeServerCookie(name: string, value: string, expires?: Date) {
    return serialize(name, value, {
            sameSite: true,
            httpOnly: true,
            expires: expires,
            secure: process.env.NODE_ENV === "production",
        }
    )
}