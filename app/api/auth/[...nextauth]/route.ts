import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const WORDPRESS_URL = process.env.WORDPRESS_URL || "https://lcj-educa.com";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.provider = account.provider;

        if (account.provider === "google") {
          // Sincroniza com o WordPress
          try {
            const res = await fetch(`${WORDPRESS_URL}/?rest_route=/lcj/v1/auth/google-login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: token.email,
                name: token.name,
                picture: token.picture, // Pode ser usado para o avatar
                googleId: profile?.sub,
              }),
            });

            const wpData = await res.json();

            if (res.ok && wpData.success) {
              token.wpToken = wpData.token;
              token.wpUserId = wpData.user_id;
              token.wpRole = wpData.role || "armember";
              console.log("WordPress sync: OK");
            } else {
              console.error("WordPress sync error:", wpData.message);
            }
          } catch (err) {
            console.error("Error syncing with WordPress:", err);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.wpToken = token.wpToken;
      session.wpUserId = token.wpUserId;
      session.wpRole = token.wpRole;
      return session;
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: "/auth", // redireciona aqui se não autenticado
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };