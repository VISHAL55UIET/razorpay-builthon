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

function RecoveryPerformance() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecoveryData = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * 1. Overall recovery statistics
         */
        const statsResponse = await api.get(
          "/analytics/recovery"
        );

        console.log(
          "Recovery Stats:",
          statsResponse.data
        );

        setStats(statsResponse.data);

        /*
         * 2. Recovery performance chart
         */
        const performanceResponse = await api.get(
          "/analytics/recovery-performance"
        );

        console.log(
          "Recovery Performance:",
          performanceResponse.data
        );

        setData(
          Array.isArray(performanceResponse.data)
            ? performanceResponse.data
            : []
        );

      } catch (error) {
        console.error(
          "Recovery analytics error:",
          error
        );

        if (error.response) {
          console.error(
            "Backend response:",
            error.response.data
          );

          console.error(
            "Status:",
            error.response.status
          );
        }

        setError(
          "Unable to load recovery analytics."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRecoveryData();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-lg font-semibold text-slate-900">
              Recovery Performance
            </h2>

            {stats && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                {Number(
                  stats.recoverySuccessRate || 0
                ).toFixed(1)}
                % success
              </span>
            )}

          </div>

          <p className="mt-1 text-sm text-slate-500">
            Recovered revenue compared with failed payment value
          </p>

        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-sm">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-indigo-500" />

            <span className="text-slate-500">
              Recovered
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-slate-300" />

            <span className="text-slate-500">
              Failed
            </span>

          </div>

        </div>

      </div>

      {/* Chart */}
      <div className="h-[300px]">

        {/* Loading */}
        {loading && (
          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

              <p className="text-sm text-slate-500">
                Loading recovery data...
              </p>

            </div>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex h-full items-center justify-center">

            <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-4 text-center">

              <p className="text-sm font-medium text-red-600">
                {error}
              </p>

              <p className="mt-1 text-xs text-red-400">
                Please check the recovery analytics service.
              </p>

            </div>

          </div>
        )}

        {/* No Data */}
        {!loading &&
          !error &&
          data.length === 0 && (
            <div className="flex h-full items-center justify-center">

              <div className="rounded-xl bg-slate-50 px-6 py-4 text-center">

                <p className="text-sm font-medium text-slate-600">
                  No recovery data available.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Recovery performance will appear here.
                </p>

              </div>

            </div>
          )}

        {/* Chart */}
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
                  left: 5,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="recoveryArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.2}
                    />

                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  tickFormatter={(value) => {

                    if (value >= 1000000) {
                      return `₹${(
                        value / 1000000
                      ).toFixed(1)}M`;
                    }

                    if (value >= 1000) {
                      return `₹${(
                        value / 1000
                      ).toFixed(0)}k`;
                    }

                    return `₹${value}`;
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                  formatter={(value, name) => {

                    const formattedValue =
                      `₹${Number(
                        value
                      ).toLocaleString("en-IN")}`;

                    if (name === "recovered") {
                      return [
                        formattedValue,
                        "Recovered Revenue",
                      ];
                    }

                    if (name === "failed") {
                      return [
                        formattedValue,
                        "Failed Revenue",
                      ];
                    }

                    return [
                      formattedValue,
                      name,
                    ];
                  }}
                />

                {/* Recovered Revenue */}
                <Area
                  type="monotone"
                  dataKey="recovered"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#recoveryArea)"
                  activeDot={{
                    r: 5,
                  }}
                />

                {/* Failed Revenue */}
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  fill="none"
                  activeDot={{
                    r: 4,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>
          )}

      </div>

      {/* Bottom Stats */}
      {stats && !loading && !error && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">

          {/* Total Attempts */}
          <div>

            <p className="text-xs text-slate-400">
              Total Attempts
            </p>

            <p className="mt-1 text-lg font-semibold text-slate-900">
              {Number(
                stats.totalRecoveryAttempts || 0
              ).toLocaleString("en-IN")}
            </p>

          </div>

          {/* Recovered Revenue */}
          <div>

            <p className="text-xs text-slate-400">
              Recovered Revenue
            </p>

            <p className="mt-1 text-lg font-semibold text-emerald-600">
              ₹
              {Number(
                stats.recoveredRevenue || 0
              ).toLocaleString("en-IN")}
            </p>

          </div>

          {/* Success Rate */}
          <div>

            <p className="text-xs text-slate-400">
              Success Rate
            </p>

            <p className="mt-1 text-lg font-semibold text-indigo-600">
              {Number(
                stats.recoverySuccessRate || 0
              ).toFixed(1)}
              %
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default RecoveryPerformance;