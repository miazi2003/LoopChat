import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoopChat",
  description: "A real-time messaging experience for direct and group conversations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
