import { ReactElement } from "react";
import { AuthHeroImage } from "./AuthHeroImage";
import { ToastProvider } from "@/providers/ToastProvider";

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
        <AuthHeroImage />
      <div className="bg-[#10141D] flex flex-col gap-12 w-full xl:w-1/2 items-center justify-center">
        <div className="absolute top-32">
          <ToastProvider />
        </div> 
          {children}
      </div>
    </main>
  );
}