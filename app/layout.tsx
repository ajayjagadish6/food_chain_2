"use client";
// Removed Geist and Geist_Mono font imports due to Google Fonts 404 errors
import "./globals.css";

// Removed Geist font setup
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";


export default function RootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session?: Session;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
