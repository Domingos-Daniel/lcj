"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingProvider } from "@/components/loading-provider";
import { BackToTop } from "@/components/back-to-top";
import { Preloader } from "@/components/preloader";
import ClientLayout from "./ClientLayout";

export default function RootClientLayout({
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
              <Preloader />
              {children}
              <BackToTop />
            </ClientLayout>
          </LoadingProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}