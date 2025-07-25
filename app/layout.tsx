"use client";
// Removed Geist and Geist_Mono font imports due to Google Fonts 404 errors
import "./globals.css";

// Removed Geist font setup
import { SessionProvider } from "next-auth/react";


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
