import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/redux-provider";
import { Toaster } from "react-hot-toast";
import ClickSpark from "@/components/ui/ClickSpark";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeClash",
  description: "Real-time coding battles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <ClickSpark
          sparkColor="#fff"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
          easing="ease-out"
        >
          <Providers>{children}</Providers>
        </ClickSpark>
        <Toaster />
      </body>
    </html>
  );
}
