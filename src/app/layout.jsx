import "@/styles/globals.css";
import Script from "next/script";
import Providers from "./providers";   // ← Import here
export const metadata = {
  title: "JotFul",
  description: "diary app",
  icon: "/favicon.ico"
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default async function RootLayout({ children }) {
  

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