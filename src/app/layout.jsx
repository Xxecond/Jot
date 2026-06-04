import "@/styles/globals.css";
import Script from "next/script";
import Providers from "./providers";   // ← Import here
import { connectDB } from "@/lib/db";

export const metadata = {
  title: "JotFul",
  description: "diary app",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default async function RootLayout({ children }) {
  try {
    await connectDB();
  } catch (err) {
    // connection errors are already handled in connectDB, but ensure layout doesn't crash
    console.error("Layout DB connect error:", err);
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}