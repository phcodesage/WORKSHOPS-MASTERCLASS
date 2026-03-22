import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exceed Learning Center - Workshops",
  description: "Workshops and Masterclass at Exceed Learning Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
