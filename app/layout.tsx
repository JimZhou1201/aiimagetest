import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Generate images using FLUX.1-schnell model",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
