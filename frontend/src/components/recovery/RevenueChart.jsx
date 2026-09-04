import { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../../api/axios";


function RevenueChart({ period = 30 }) {

  const [data, setData] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");
  useEffect(() => {

    const fetchRevenueData = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/analytics/revenue",
            {
              params: {
                period,
              },
            }
          );

        console.log(
          "Revenue Analytics:",
          response.data
        );

        setData(
          response.data || []
        );

      } catch (error) {

        console.error(
          "Revenue analytics error:",
          error
        );

        setError(
          "Unable to load revenue analytics."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchRevenueData();

  }, [period]);
  const periodLabel =
    period === 7
      ? "Last 7 days"
      : period === 30
        ? "Last 30 days"
        : period === 90
          ? "Last 90 days"
          : "This year";


  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Revenue Recovery
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Revenue and recovered amount over time
          </p>

        </div>


        <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">

          {periodLabel}

        </div>

      </div>
      <div className="h-[320px] w-full">

        {loading && (

          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

              <p className="text-sm text-slate-500">
                Loading revenue data...
              </p>

            </div>

          </div>

        )}


        {!loading && error && (

          <div className="flex h-full items-center justify-center">

            <p className="text-sm text-red-500">
              {error}
            </p>

          </div>

        )}


        {!loading &&
          !error &&
          data.length === 0 && (

            <div className="flex h-full items-center justify-center">

              <div className="text-center">

                <p className="text-sm font-medium text-slate-600">
                  No revenue data available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  There is no payment activity for this period.
                </p>

              </div>

            </div>

          )}


        {!loading &&
          !error &&
          data.length > 0 && (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#4f46e5"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#4f46e5"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>


                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />


                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    `₹${Number(
                      value / 1000
                    ).toFixed(0)}k`
                  }
                />


                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border:
                      "1px solid #e2e8f0",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                  formatter={(
                    value,
                    name
                  ) => [

                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`,

                    name === "revenue"
                      ? "Total Revenue"
                      : "Recovered Revenue",

                  ]}
                />


                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />


                <Area
                  type="monotone"
                  dataKey="recovered"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="none"
                />

              </AreaChart>

            </ResponsiveContainer>

          )}

      </div>
      <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-4">

        <div className="flex items-center gap-2">

          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />

          <span className="text-sm text-slate-500">
            Total Revenue
          </span>

        </div>


        <div className="flex items-center gap-2">

          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

          <span className="text-sm text-slate-500">
            Recovered Revenue
          </span>

        </div>

      </div>

    </div>

  );
}


export default RevenueChart;