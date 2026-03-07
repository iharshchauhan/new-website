import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "harshc_ | Product & Growth",
  description:
    "Product/Growth enthusiast and an amateur human figuring out both the world and the web.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MCTJXL5C');`,
          }}
        />
      </head>
      <body
        className={`${nunitoSans.variable} ${cormorantGaramond.variable} antialiased min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground`}
        suppressHydrationWarning
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MCTJXL5C"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AnimatedBackground />
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
        <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
