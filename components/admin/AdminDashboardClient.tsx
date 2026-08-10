"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";

type Registration = {
  id: number;
  explorer_no?: string;
  child_name?: string;
  age?: number;
  sex?: string;
  birthdate?: string | null;
  barangay?: string | null;
  parent_name?: string | null;
  contact_number?: string | null;
  checked_in?: boolean;
  created_at?: string | null;
};

export default function AdminDashboardClient() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("");
  const [filterSex, setFilterSex] = useState("");

  async function fetchRegistrations() {
    setLoading(true);
    const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("fetch error", error);
      setRegistrations([]);
    } else {
      setRegistrations(data as Registration[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    void fetchRegistrations();

    const subscription = supabase.channel("public:registrations").on("postgres_changes", { event: "INSERT", schema: "public", table: "registrations" }, (payload) => {
      setRegistrations((r) => [payload.new as Registration, ...r]);
    }).subscribe();

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, []);

  const filtered = registrations.filter((r) => {
    if (search) {
      const s = search.toLowerCase();
      const name = (r.child_name || "").toLowerCase();
      const explorer = (r.explorer_no || "").toLowerCase();
      if (!name.includes(s) && !explorer.includes(s)) return false;
    }
    if (filterBarangay && (r.barangay || "") !== filterBarangay) return false;
    if (filterSex && (r.sex || "") !== filterSex) return false;
    return true;
  });

  const barangays = Array.from(new Set(registrations.map((r) => r.barangay).filter(Boolean)) as string[]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    const totalCount = registrations.length;
    const checkedInCount = registrations.filter((r) => r.checked_in).length;
    const pendingCount = totalCount - checkedInCount;

    const barangayCounts = new Map<string, number>();
    const genderCounts = new Map<string, number>();
    const ageCounts = new Map<number, number>();
    const dailyCounts = new Map<string, number>();

    for (const r of registrations) {
      const barangayName = r.barangay || "Not in Claver";
      barangayCounts.set(barangayName, (barangayCounts.get(barangayName) || 0) + 1);

      const genderName = r.sex || "Unspecified";
      genderCounts.set(genderName, (genderCounts.get(genderName) || 0) + 1);

      if (typeof r.age === "number") {
        ageCounts.set(r.age, (ageCounts.get(r.age) || 0) + 1);
      }

      const day = r.created_at ? new Date(r.created_at).toLocaleDateString() : "Unknown";
      dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
    }

    const byBarangay = Array.from(barangayCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const byGender = Array.from(genderCounts.entries()).map(([name, value]) => ({ name, value }));

    const byAge = Array.from(ageCounts.entries())
      .map(([age, count]) => ({ age: `${age}`, count }))
      .sort((a, b) => Number(a.age) - Number(b.age));

    const byDay = Array.from(dailyCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalCount,
      checkedInCount,
      pendingCount,
      byBarangay,
      byGender,
      byAge,
      byDay,
    };
  }, [registrations]);

  return (
    <div>
      <AdminDashboardCharts data={chartData} loading={loading} />

      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or explorer no" className="w-full rounded-xl border p-3" />
        </div>

        <div className="flex gap-3">
          <select value={filterBarangay} onChange={(e) => setFilterBarangay(e.target.value)} className="rounded-xl border p-3">
            <option value="">All Barangays</option>
            {barangays.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={filterSex} onChange={(e) => setFilterSex(e.target.value)} className="rounded-xl border p-3">
            <option value="">All Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto bg-white rounded-2xl p-4 shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3">Reg ID</th>
              <th className="p-3">Explorer No</th>
              <th className="p-3">Child</th>
              <th className="p-3">Age</th>
              <th className="p-3">Sex</th>
              <th className="p-3">Birthdate</th>
              <th className="p-3">Barangay</th>
              <th className="p-3">Parent/Guardian</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Registered At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={11} className="p-6 text-center">Loading…</td></tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr><td colSpan={11} className="p-6 text-center">No registrations found.</td></tr>
            )}

            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 align-top">{r.id}</td>
                <td className="p-3 align-top">{r.explorer_no ?? "—"}</td>
                <td className="p-3 align-top">{r.child_name}</td>
                <td className="p-3 align-top">{r.age ?? "—"}</td>
                <td className="p-3 align-top">{r.sex ?? "—"}</td>
                <td className="p-3 align-top">{r.birthdate ?? "—"}</td>
                <td className="p-3 align-top">{r.barangay ?? "—"}</td>
                <td className="p-3 align-top">{r.parent_name ?? "—"}</td>
                <td className="p-3 align-top">{r.contact_number ?? "—"}</td>
                <td className="p-3 align-top">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
                <td className="p-3 align-top">
                  <button className="rounded-lg bg-blue-600 text-white px-3 py-2" onClick={() => alert(JSON.stringify(r, null, 2))}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
