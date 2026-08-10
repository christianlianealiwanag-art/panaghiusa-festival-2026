"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";
import * as XLSX from "xlsx";

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

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

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

    const subscription = supabase
      .channel("public:registrations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "registrations",
        },
        (payload) => {
          setRegistrations((r) => [
            payload.new as Registration,
            ...r,
          ]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, []);

  const filtered = registrations.filter((r) => {
    if (search) {
      const s = search.toLowerCase();
      const name = (r.child_name || "").toLowerCase();
      const explorer = (r.explorer_no || "").toLowerCase();

      if (!name.includes(s) && !explorer.includes(s)) {
        return false;
      }
    }

    if (
      filterBarangay &&
      (r.barangay || "") !== filterBarangay
    ) {
      return false;
    }

    if (filterSex && (r.sex || "") !== filterSex) {
      return false;
    }

    return true;
  });

  const barangays = Array.from(
    new Set(
      registrations
        .map((r) => r.barangay)
        .filter(
          (barangay): barangay is string =>
            Boolean(barangay)
        )
    )
  ).sort((a, b) => a.localeCompare(b));

  /* =======================================================
     EXPORT REGISTRATION MASTERLIST
  ======================================================= */

  function exportRegistrationMasterlist() {
    const sorted = [...registrations].sort((a, b) =>
      (a.explorer_no || "").localeCompare(
        b.explorer_no || "",
        undefined,
        {
          numeric: true,
        }
      )
    );

    const rows = sorted.map((r, index) => ({
      "No.": index + 1,
      "Explorer No.": r.explorer_no || "",
      "Child's Name": r.child_name || "",
      Age: r.age ?? "",
      Sex: r.sex || "",
      Birthdate: r.birthdate || "",
      Barangay: r.barangay || "",
      "Parent/Guardian": r.parent_name || "",
      "Contact Number": r.contact_number || "",
      "Checked In": r.checked_in ? "Yes" : "No",
      "Registered At": r.created_at
        ? new Date(r.created_at).toLocaleString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 30 },
      { wch: 8 },
      { wch: 12 },
      { wch: 14 },
      { wch: 20 },
      { wch: 30 },
      { wch: 18 },
      { wch: 12 },
      { wch: 24 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Registration Masterlist"
    );

    XLSX.writeFile(
      workbook,
      "Claver-Childrens-Festival-2026-Registration-Masterlist.xlsx"
    );
  }

  /* =======================================================
     EXPORT SAFARI EXPLORER KIT ACKNOWLEDGMENT RECEIPT
  ======================================================= */

  function exportSafariKitAcknowledgment() {
    const sorted = [...registrations].sort((a, b) =>
      (a.explorer_no || "").localeCompare(
        b.explorer_no || "",
        undefined,
        {
          numeric: true,
        }
      )
    );

    const data = [
      ["CLAVER CHILDREN'S FESTIVAL"],
      [
        "SAFARI EXPLORER KIT – ACKNOWLEDGMENT RECEIPT",
      ],
      [
        "September 5, 2026 | Claver Sports Complex Grounds",
      ],
      [],
      [
        "I hereby acknowledge receipt of the Safari Explorer Kit issued to the registered child indicated below during the Panaghiusa Festival 2026 – Claver Children's Festival.",
      ],
      [],
      [
        "No.",
        "Explorer No.",
        "Child's Name",
        "Age",
        "Barangay",
        "Parent/Guardian",
        "Check-In",
        "Signature",
      ],
      ...sorted.map((r, index) => [
        index + 1,
        r.explorer_no || "",
        r.child_name || "",
        r.age ?? "",
        r.barangay || "",
        r.parent_name || "",
        r.checked_in ? "✓" : "",
        "",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    worksheet["!merges"] = [
      XLSX.utils.decode_range("A1:H1"),
      XLSX.utils.decode_range("A2:H2"),
      XLSX.utils.decode_range("A3:H3"),
      XLSX.utils.decode_range("A5:H5"),
    ];

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 30 },
      { wch: 8 },
      { wch: 20 },
      { wch: 30 },
      { wch: 12 },
      { wch: 28 },
    ];

    worksheet["!rows"] = [
      { hpt: 24 },
      { hpt: 28 },
      { hpt: 22 },
      { hpt: 10 },
      { hpt: 42 },
      { hpt: 10 },
      { hpt: 24 },
      ...sorted.map(() => ({ hpt: 30 })),
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Safari Kit Acknowledgment"
    );

    XLSX.writeFile(
      workbook,
      "Safari-Explorer-Kit-Acknowledgment-Receipt.xlsx"
    );
  }

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    const totalCount = registrations.length;

    const checkedInCount = registrations.filter(
      (r) => r.checked_in
    ).length;

    const pendingCount =
      totalCount - checkedInCount;

    const barangayCounts = new Map<string, number>();
    const genderCounts = new Map<string, number>();
    const ageCounts = new Map<number, number>();
    const dailyCounts = new Map<string, number>();

    for (const r of registrations) {
      const barangayName =
        r.barangay || "Not in Claver";

      barangayCounts.set(
        barangayName,
        (barangayCounts.get(barangayName) || 0) + 1
      );

      const genderName =
        r.sex || "Unspecified";

      genderCounts.set(
        genderName,
        (genderCounts.get(genderName) || 0) + 1
      );

      if (typeof r.age === "number") {
        ageCounts.set(
          r.age,
          (ageCounts.get(r.age) || 0) + 1
        );
      }

      const day = r.created_at
        ? new Date(
            r.created_at
          ).toLocaleDateString()
        : "Unknown";

      dailyCounts.set(
        day,
        (dailyCounts.get(day) || 0) + 1
      );
    }

    const byBarangay = Array.from(
      barangayCounts.entries()
    )
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const byGender = Array.from(
      genderCounts.entries()
    ).map(([name, value]) => ({
      name,
      value,
    }));

    const byAge = Array.from(
      ageCounts.entries()
    )
      .map(([age, count]) => ({
        age: `${age}`,
        count,
      }))
      .sort(
        (a, b) =>
          Number(a.age) - Number(b.age)
      );

    const byDay = Array.from(
      dailyCounts.entries()
    )
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

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
      <AdminDashboardCharts
  data={chartData}
  loading={loading}
/>

      {/* ===================================================
          EXPORT BUTTONS
      =================================================== */}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={exportRegistrationMasterlist}
          disabled={registrations.length === 0}
          className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          📊 Export Registration Masterlist
        </button>

        <button
          type="button"
          onClick={exportSafariKitAcknowledgment}
          disabled={registrations.length === 0}
          className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-green-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          🧾 Export Safari Explorer Kit Acknowledgment Receipt
        </button>
      </div>

      {/* ===================================================
          SEARCH AND FILTERS
      =================================================== */}

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name or explorer no"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filterBarangay}
            onChange={(e) =>
              setFilterBarangay(e.target.value)
            }
            className="rounded-xl border p-3"
          >
            <option value="">
              All Barangays
            </option>

            {barangays.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={filterSex}
            onChange={(e) =>
              setFilterSex(e.target.value)
            }
            className="rounded-xl border p-3"
          >
            <option value="">All Sex</option>
            <option value="Male">
              Male
            </option>
            <option value="Female">
              Female
            </option>
          </select>
        </div>
      </div>

      {/* ===================================================
          REGISTRATION TABLE
      =================================================== */}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-4 shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3">
                Reg ID
              </th>

              <th className="p-3">
                Explorer No
              </th>

              <th className="p-3">
                Child
              </th>

              <th className="p-3">
                Age
              </th>

              <th className="p-3">
                Sex
              </th>

              <th className="p-3">
                Birthdate
              </th>

              <th className="p-3">
                Barangay
              </th>

              <th className="p-3">
                Parent/Guardian
              </th>

              <th className="p-3">
                Contact
              </th>

              <th className="p-3">
                Registered At
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={12}
                  className="p-6 text-center"
                >
                  Loading…
                </td>
              </tr>
            )}

            {!loading &&
              filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="p-6 text-center"
                  >
                    No registrations found.
                  </td>
                </tr>
              )}

            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-t"
              >
                <td className="p-3 align-top">
                  {r.id}
                </td>

                <td className="p-3 align-top font-semibold text-green-800">
                  {r.explorer_no ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.child_name}
                </td>

                <td className="p-3 align-top">
                  {r.age ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.sex ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.birthdate ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.barangay ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.parent_name ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.contact_number ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.created_at
                    ? new Date(
                        r.created_at
                      ).toLocaleString()
                    : "—"}
                </td>

                <td className="p-3 align-top">
                  {r.checked_in ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                      Checked In
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                      Pending
                    </span>
                  )}
                </td>

                <td className="p-3 align-top">
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    onClick={() =>
                      alert(
                        JSON.stringify(
                          r,
                          null,
                          2
                        )
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}