"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { BackToTop } from "@/components/back-to-top";
import { LoadingProvider } from "@/components/loading-provider";
import { Preloader } from "@/components/preloader";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/auth-context";
import ClientLayout from "./ClientLayout";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LoadingProvider>
            <ClientLayout>
              {children}
              <BackToTop />
            </ClientLayout>
          </LoadingProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}