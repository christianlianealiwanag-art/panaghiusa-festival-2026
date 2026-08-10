import ProtectedRoute from "@/components/admin/ProtectedRoute";
import ClientOnly from "@/components/admin/ClientOnly";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/feedback"
                className="rounded-full bg-yellow-400 px-5 py-2 font-bold text-green-950 transition hover:bg-yellow-300"
              >
                Parent Feedback
              </Link>

              <div className="text-right">
                <div className="text-sm text-gray-500">Registered entries</div>
                <div className="text-2xl font-extrabold text-green-700">Secure access</div>
              </div>
            </div>
          </header>

          <section className="mt-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <ClientOnly>
                <AdminDashboardClient />
              </ClientOnly>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
