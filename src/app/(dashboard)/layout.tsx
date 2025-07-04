import NavbarPlain from "@/components/ui/NavbarPlain";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#10141D] text-white">
      <NavbarPlain />
      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
}
