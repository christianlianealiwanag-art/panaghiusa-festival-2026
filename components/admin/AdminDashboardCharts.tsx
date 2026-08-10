"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  totalCount: number;
  checkedInCount: number;
  pendingCount: number;
  byBarangay: { name: string; count: number }[];
  byGender: { name: string; value: number }[];
  byAge: { age: string; count: number }[];
  byDay: { date: string; count: number }[];
};

type AdminDashboardChartsProps = {
  data: ChartData;
  loading: boolean;
};

const GREEN = "#15803d";
const YELLOW = "#facc15";
const GENDER_COLORS = ["#15803d", "#facc15", "#9ca3af"];

export default function AdminDashboardCharts({
  data,
  loading,
}: AdminDashboardChartsProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">
        Loading dashboard…
      </div>
    );
  }

  if (data.totalCount === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">
        No registrations yet — charts will appear here once explorers start
        signing up.
      </div>
    );
  }

  return (
    <div>
      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-green-700 p-5 text-white shadow">
          <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
            Total Registered
          </p>
          <p className="mt-2 text-3xl font-black">{data.totalCount}</p>
        </div>

        <div className="rounded-2xl bg-yellow-400 p-5 text-green-950 shadow">
          <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
            Checked In
          </p>
          <p className="mt-2 text-3xl font-black">{data.checkedInCount}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 text-gray-900 shadow ring-1 ring-gray-100">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Not Yet Arrived
          </p>
          <p className="mt-2 text-3xl font-black">{data.pendingCount}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 text-gray-900 shadow ring-1 ring-gray-100">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Barangays Represented
          </p>
          <p className="mt-2 text-3xl font-black">
            {data.byBarangay.length}
          </p>
        </div>
      </div>

      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Registrations by Barangay */}
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="mb-4 font-bold text-green-900">
            Registrations by Barangay
          </p>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.byBarangay} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill={GREEN} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="mb-4 font-bold text-green-900">
            Gender Distribution
          </p>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.byGender}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.byGender.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Registrations by Age */}
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="mb-4 font-bold text-green-900">
            Registrations by Age
          </p>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.byAge}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill={YELLOW} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Registrations Over Time */}
        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="mb-4 font-bold text-green-900">
            Registrations Over Time
          </p>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.byDay}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke={GREEN}
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
