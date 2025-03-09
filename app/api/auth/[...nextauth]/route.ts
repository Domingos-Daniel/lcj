import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook"; // Adicionar provider do Facebook
import type { NextAuthOptions } from "next-auth";

const WORDPRESS_URL = process.env.WORDPRESS_URL || "https://lcj-educa.com";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Se temos um token de acesso (durante o login inicial), salve-o no JWT
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        
        // Se login via Google, sincronizar com WordPress
        if (account.provider === "google") {
          try {
            // Chamar API do WordPress para registrar/autenticar o usuário
            const wpResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/?rest_route=/lcj/v1/oauth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: token.email,
                name: token.name,
                picture: token.picture,
              }),
            });

            if (wpResponse.ok) {
              const wpData = await wpResponse.json();
              // Armazenar o token WP no token do NextAuth
              token.wpToken = wpData.token;
              token.wpUserId = wpData.user_id;
            }
          } catch (error) {
            console.error("Erro ao sincronizar com WordPress:", error);
          }
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      // Passar token e dados do WP para a sessão
      if (session.user && token) {
        session.user.wpToken = token.wpToken as string;
        session.user.wpUserId = token.wpUserId as number;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    
    async signIn({ user }) {
      // Permitir todos os logins
      return true;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };