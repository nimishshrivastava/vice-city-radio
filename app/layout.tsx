import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vice City Radio",
  description: "A nostalgic radio for timeless souls.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
