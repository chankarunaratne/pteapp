import type { Metadata } from "next";
import { Inter, Noto_Sans_Sinhala } from "next/font/google";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
});

export const metadata: Metadata = {
  title: "PTElanka",
  description:
    "PTE Academic practice for Sri Lankan students, with Sinhala explanations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansSinhala.variable} font-sans`}
      >
        <LanguageProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
