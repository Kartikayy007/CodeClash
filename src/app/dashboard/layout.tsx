import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import Navbar from '@/components/ui/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen bg-[#15171B] text-white">
        <Navbar />
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
  );
}