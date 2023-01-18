import assert from "assert";

export function getRedirectURL(path: string) {
    assert(path.startsWith("/"))
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000';

    return url + path
}