import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persistir o token de acesso no token JWT para uso posterior
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Enviar tokens para o cliente
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account, profile }) {
      // Integração com WordPress
      if (account.provider === "google") {
        try {
          // Enviar os dados do Google para o WordPress
          const response = await fetch(`${process.env.WORDPRESS_URL}/?rest_route=/lcj/v1/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: profile.sub,
              accessToken: account.access_token,
            }),
          });

          const data = await response.json();
          
          if (response.ok && data.success) {
            // WordPress autenticou com sucesso
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Erro na autenticação com WordPress:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };