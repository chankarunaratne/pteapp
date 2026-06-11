import type { Metadata } from "next";
import { Inter, Noto_Sans_Sinhala } from "next/font/google";
import Sidebar from "@/components/Sidebar";
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
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 px-6 py-10 lg:px-12">
            <div className="mx-auto w-full max-w-3xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
