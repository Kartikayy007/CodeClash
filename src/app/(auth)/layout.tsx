import { ReactElement } from "react";
import { AuthHeroImage } from "./AuthHeroImage";

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
      <div className="bg-[#10141D] flex w-1/2 items-center justify-center">
        {children}
      </div>
    </main>
  );
}