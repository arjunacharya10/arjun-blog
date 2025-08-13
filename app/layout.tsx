import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Trust Collapse Simulator",
  description: "A two-world simulation of trust and societal collapse.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
