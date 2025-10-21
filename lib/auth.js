import CredentialsProvider from "next-auth/providers/credentials";
import {verifyUser} from "@/app/helper-functions/authHelpers";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username) {
                    return null;
                }

                const user = await verifyUser(credentials.username, credentials.password  || '');

                if (!user) {
                    return null;
                }

                return {
                    id: user.id,
                    username: user.username,
                    needsPasswordReset: user.needsPasswordReset
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 365 * 24 * 60 * 60,
    },

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.needsPasswordReset = user.needsPasswordReset || false;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    username: token.username,
                    needsPasswordReset: token.needsPasswordReset,
                };
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};