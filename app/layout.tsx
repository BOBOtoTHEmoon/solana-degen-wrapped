import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solana Degen Wrapped",
  description: "Your 2025 memecoin journey, analyzed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}