import Navbar from '@/components/ui/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen bg-[#15171B] text-white">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
  );
}
