import Image from "next/image";
import { ReactElement } from "react";

export type AuthChildProps = {
  image: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactElement<AuthChildProps>;
}>) {

  return (
    <main className="flex h-screen w-full">
      <div className="bg-[#282D37] w-1/2">
        <Image 
          src='/logo.svg'
          alt="logo"
          width={162}
          height={40}
          className="relative top-8 left-12"
          priority
        />
      </div>

      <div className="bg-[#10141D] flex w-1/2 items-center justify-center">
        {children}
      </div>
    </main>
  );
}