import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nerdy Wars",
  description: "Prove you're the nerdiest one.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
