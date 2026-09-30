import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bending Spoons",
  description: "We build apps used by millions of people.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
