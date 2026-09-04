import { useEffect, useState } from "react";
import {
  Users,
  Clock3,
  CircleCheck,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

import api from "../../api/axios";


function RecoverySummary() {

  const [activeCustomers, setActiveCustomers] = useState(0);
  const [pendingRetries, setPendingRetries] = useState(0);
  const [successfullyRecovered, setSuccessfullyRecovered] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const fetchRecoverySummary = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          recoveryResponse,
          paymentsResponse,
        ] = await Promise.all([
          api.get("/analytics/recovery"),
          api.get("/payments/recent"),
        ]);


        const recovery =
          recoveryResponse.data || {};

        const payments =
          paymentsResponse.data || [];


        console.log(
          "Recovery Summary Data:",
          recovery
        );

        console.log(
          "Recent Payments:",
          payments
        );
        const uniqueCustomers = new Set();


        payments.forEach((payment) => {

          if (payment.customerId) {

            uniqueCustomers.add(
              payment.customerId
            );

          }

        });


        setActiveCustomers(
          uniqueCustomers.size
        );
        setPendingRetries(
          Number(
            recovery.pendingRecoveryAttempts || 0
          )
        );
        setSuccessfullyRecovered(
          Number(
            recovery.recoveredPayments || 0
          )
        );


      } catch (error) {

        console.error(
          "Recovery summary error:",
          error
        );

        setError(
          "Unable to load recovery summary."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchRecoverySummary();

  }, []);


  /*
   * Summary cards
   */
  const summary = [

    {
      title: "Active customers",
      value:
        activeCustomers.toLocaleString("en-IN"),

      description:
        "Customers with recent payments",

      icon: Users,

      iconClass:
        "bg-blue-50 text-blue-600",

      accent:
        "text-blue-600",

    },

    {
      title: "Pending retries",

      value:
        pendingRetries.toLocaleString("en-IN"),

      description:
        "Payments waiting for recovery",

      icon: Clock3,

      iconClass:
        "bg-amber-50 text-amber-600",

      accent:
        "text-amber-600",

    },

    {
      title: "Successfully recovered",

      value:
        successfullyRecovered.toLocaleString(
          "en-IN"
        ),

      description:
        "Payments recovered successfully",

      icon: CircleCheck,

      iconClass:
        "bg-emerald-50 text-emerald-600",

      accent:
        "text-emerald-600",

    },

  ];
  if (loading) {

    return (

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

        {[1, 2, 3].map((item) => (

          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex items-center gap-4">

              <div className="h-11 w-11 rounded-xl bg-slate-100" />

              <div className="flex-1">

                <div className="h-3 w-28 rounded bg-slate-100" />

                <div className="mt-3 h-6 w-20 rounded bg-slate-100" />

              </div>

            </div>

          </div>

        ))}

      </div>

    );

  }

  if (error) {

    return (

      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">

            <CircleCheck size={17} />

          </div>

          <div>

            <p className="text-sm font-semibold text-red-700">
              Recovery summary unavailable
            </p>

            <p className="mt-0.5 text-xs text-red-500">
              {error}
            </p>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

      {summary.map((item) => {

        const Icon = item.icon;


        return (

          <div
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >

            {/* Top row */}

            <div className="flex items-start justify-between">

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClass}`}
              >

                <Icon
                  size={20}
                  strokeWidth={2}
                />

              </div>


              <div className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1">

                <TrendingUp
                  size={12}
                  className={item.accent}
                />
                <span
                  className={`text-[10px] font-semibold ${item.accent}`}
                >
                  Live
                </span>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {item.title}
              </p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </p>
                <ArrowUpRight
                  size={17}
                  className="mb-1 text-slate-300 transition group-hover:text-slate-500"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {item.description}
              </p>
            </div>

            {/* Bottom accent */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-full ${item.iconClass.split(" ")[0]}`}
            />
          </div>
        );
      })}
    </div>
  );
}
export default RecoverySummary;