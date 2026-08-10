import ProtectedRoute from "@/components/admin/ProtectedRoute";
import ClientOnly from "@/components/admin/ClientOnly";
import AdminFeedbackClient from "@/components/admin/AdminFeedbackClient";
import Link from "next/link";

export default function AdminFeedbackPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parent Feedback</h1>
              <p className="text-sm text-gray-500">
                Only visible to admins. Not shown to the public.
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="rounded-full bg-green-700 px-5 py-2 font-bold text-white transition hover:bg-green-800"
            >
              Back to Dashboard
            </Link>
          </header>

          <section className="mt-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <ClientOnly>
                <AdminFeedbackClient />
              </ClientOnly>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
