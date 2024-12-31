import { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import "./globals.css";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'CodeClash',
  description: 'CodeClash Platform',
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.svg' },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
