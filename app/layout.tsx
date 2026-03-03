import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";

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
      <body
        className="antialiased min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground"
        suppressHydrationWarning
      >
        <AnimatedBackground />
        <Navigation />
        <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 md:px-12 max-w-3xl mx-auto w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
