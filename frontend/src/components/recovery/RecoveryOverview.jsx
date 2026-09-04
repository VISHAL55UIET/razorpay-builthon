import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import api from "../../api/axios";


function RecoveryOverview() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const fetchRecoveryOverview = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get("/analytics/recovery");

        setStats(response.data);

      } catch (error) {

        console.error(
          "Recovery overview error:",
          error
        );

        setError(
          "Unable to load recovery overview."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchRecoveryOverview();

  }, []);
  const successful =
    Number(
      stats?.successfulRecoveryAttempts ?? 0
    );

  const pending =
    Number(
      stats?.pendingRecoveryAttempts ?? 0
    );

  const failed =
    Number(
      stats?.failedRecoveryAttempts ?? 0
    );


  const total =
    successful +
    pending +
    failed;


  const recoveryRate =
    Number(
      stats?.recoverySuccessRate ?? 0
    );
  const data = [

    {
      name: "Recovered",
      value: successful,
      color: "#635bff",
      icon: CheckCircle2,
      iconClass:
        "bg-indigo-50 text-indigo-600",
    },

    {
      name: "In recovery",
      value: pending,
      color: "#f59e0b",
      icon: Clock3,
      iconClass:
        "bg-amber-50 text-amber-600",
    },

    {
      name: "Unrecoverable",
      value: failed,
      color: "#cbd5e1",
      icon: XCircle,
      iconClass:
        "bg-slate-100 text-slate-500",
    },

  ];
  const chartData =
    total > 0
      ? data
      : [
          {
            name: "No Data",
            value: 1,
            color: "#eef2f7",
          },
        ];


  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h2 className="text-lg font-semibold text-slate-900">
              Recovery overview
            </h2>

            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
              LIVE
            </span>

          </div>


          <p className="mt-1 text-sm text-slate-500">
            Current recovery pipeline
          </p>

        </div>


        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

          <TrendingUp
            size={19}
            strokeWidth={1.9}
          />

        </div>

      </div>

      {loading && (

        <div className="mt-6">

          <div className="flex h-[190px] items-center justify-center">

            <div className="flex flex-col items-center">

              <div className="h-32 w-32 animate-pulse rounded-full border-[16px] border-slate-100" />

              <div className="mt-4 h-3 w-28 animate-pulse rounded bg-slate-100" />

            </div>

          </div>


          <div className="mt-5 space-y-3">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-3">

                  <div className="h-2.5 w-2.5 rounded-full bg-slate-100" />

                  <div className="h-3 w-24 rounded bg-slate-100" />

                </div>

                <div className="h-3 w-8 rounded bg-slate-100" />

              </div>

            ))}

          </div>

        </div>

      )}

      {!loading && error && (

        <div className="mt-6 flex h-[260px] items-center justify-center rounded-xl bg-red-50">

          <div className="text-center">

            <XCircle
              size={25}
              className="mx-auto text-red-400"
            />

            <p className="mt-2 text-sm font-medium text-red-600">
              {error}
            </p>

            <p className="mt-1 text-xs text-red-400">
              Please try refreshing the dashboard.
            </p>

          </div>

        </div>

      )}


      {!loading && !error && (

        <>
          <div className="relative mx-auto mt-5 h-[205px] w-[205px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={chartData}
                  innerRadius={67}
                  outerRadius={84}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={
                    total > 0 ? 2 : 0
                  }
                  cornerRadius={
                    total > 0 ? 4 : 0
                  }
                >

                  {chartData.map(
                    (item, index) => (

                      <Cell
                        key={`${item.name}-${index}`}
                        fill={item.color}
                      />

                    )
                  )}

                </Pie>


                {total > 0 && (

                  <Tooltip
                    formatter={(value) => [
                      value,
                      "Attempts",
                    ]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 4px 12px rgba(15,23,42,0.08)",
                      fontSize: "12px",
                    }}
                  />

                )}

              </PieChart>

            </ResponsiveContainer>


            {/* Center */}

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

              <span className="text-3xl font-bold tracking-tight text-slate-900">

                {recoveryRate.toFixed(1)}%

              </span>


              <span className="mt-1 text-xs font-medium text-slate-400">

                recovery rate

              </span>

            </div>

          </div>
          <div className="mt-2 text-center">

            <p className="text-xs text-slate-400">
              Total recovery attempts
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
              {total.toLocaleString("en-IN")}
            </p>

          </div>
          <div className="mt-6 space-y-3">

            {data.map((item) => {

              const Icon = item.icon;

              const percentage =
                total > 0
                  ? (item.value / total) * 100
                  : 0;


              return (

                <div
                  key={item.name}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-50"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconClass}`}
                      >

                        <Icon
                          size={15}
                          strokeWidth={2}
                        />

                      </div>


                      <div>

                        <p className="text-sm font-medium text-slate-700">
                          {item.name}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {percentage.toFixed(1)}% of attempts
                        </p>

                      </div>

                    </div>


                    <span className="text-sm font-bold text-slate-900">
                      {item.value.toLocaleString("en-IN")}
                    </span>

                  </div>


                  {/* Progress */}

                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>

      )}
    </div>
  );

}     
export default RecoveryOverview;