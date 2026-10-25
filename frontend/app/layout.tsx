import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});


export const metadata: Metadata = {
  title: "111 production club",
  description: "Студия веб-разработки и мерч. Сайты руками на Django, от 7 дней.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
        {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId="G-WSK55KLZLX" />}
    </html>
  );
}
