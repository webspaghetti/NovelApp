import { getToken } from "next-auth/jwt";

export async function auth(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) return { isLoggedIn: false, user: null };

    const user = {
        id: token.id,
        username: token.username,
        needsPasswordReset: token.needsPasswordReset,
    };

    return {
        isLoggedIn: true,
        user,
    };
}
