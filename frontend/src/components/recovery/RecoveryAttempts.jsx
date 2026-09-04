import { useEffect, useState } from "react";
import {
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock3,
  CreditCard,
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";

function RecoveryAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecoveryAttempts();
  }, []);

  const fetchRecoveryAttempts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/payments/recent"
      );

      console.log(
        "Recovery Attempts:",
        response.data
      );

      setAttempts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Recovery attempts error:",
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
        "Unable to load recovery attempts."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (payment) => {
    const status =
      payment?.status?.toUpperCase();

    if (
      status === "SUCCESS" ||
      status === "RECOVERED" ||
      status === "PAID"
    ) {
      return "RECOVERED";
    }

    if (
      status === "RETRYING" ||
      status === "RETRY_SCHEDULED"
    ) {
      return "RETRYING";
    }

    if (
      status === "FAILED" ||
      status === "FAILURE"
    ) {
      return "FAILED";
    }

    if (
      payment?.nextRetryAt
    ) {
      return "RETRYING";
    }

    return status || "PENDING";
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "RECOVERED":
        return {
          label: "Recovered",
          className:
            "bg-emerald-50 text-emerald-600",
          icon: CheckCircle2,
        };

      case "RETRYING":
        return {
          label: "Retry scheduled",
          className:
            "bg-amber-50 text-amber-600",
          icon: Clock3,
        };

      case "FAILED":
        return {
          label: "Failed",
          className:
            "bg-red-50 text-red-600",
          icon: XCircle,
        };

      default:
        return {
          label: "Pending",
          className:
            "bg-slate-100 text-slate-600",
          icon: AlertCircle,
        };
    }
  };

  const formatAmount = (amount) => {
    if (amount == null) {
      return "₹0";
    }

    /*
     * Razorpay amounts are generally stored
     * in paise.
     */
    const value = Number(amount);

    return `₹${(
      value / 100
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "—";
    }
  };

  const getCustomerName = (payment) => {
    return (
      payment?.customerName ||
      payment?.customer?.name ||
      payment?.customerEmail ||
      payment?.customer?.email ||
      "Unknown customer"
    );
  };

  const getPaymentId = (payment) => {
    return (
      payment?.paymentId ||
      payment?.id ||
      payment?.razorpayPaymentId ||
      "—"
    );
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <RefreshCcw size={19} />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Recovery Attempts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track payment retries and recovered transactions.
              </p>

            </div>

          </div>

        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={fetchRecoveryAttempts}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw
            size={15}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 flex h-48 items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading recovery attempts...
            </p>

          </div>

        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-5">

          <div className="flex items-center gap-3">

            <AlertCircle
              size={18}
              className="text-red-500"
            />

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

          </div>

        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        attempts.length === 0 && (
          <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">

            <CreditCard
              size={28}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              No recovery attempts found.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Failed payments and retry attempts will appear here.
            </p>

          </div>
        )}

      {/* Table */}
      {!loading &&
        !error &&
        attempts.length > 0 && (
          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="border-b border-slate-100">

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Payment
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Next Retry
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {attempts.map(
                  (payment, index) => {

                    const status =
                      getStatus(payment);

                    const config =
                      getStatusConfig(
                        status
                      );

                    const StatusIcon =
                      config.icon;

                    return (
                      <tr
                        key={
                          payment?.paymentId ||
                          payment?.id ||
                          index
                        }
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                      >

                        {/* Payment */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <CreditCard
                                size={16}
                              />
                            </div>

                            <div>

                              <p className="text-sm font-semibold text-slate-900">
                                {getPaymentId(
                                  payment
                                )}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {formatDate(
                                  payment?.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Customer */}
                        <td className="px-4 py-4">

                          <p className="text-sm font-medium text-slate-700">
                            {getCustomerName(
                              payment
                            )}
                          </p>

                          {payment?.customerEmail && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {
                                payment.customerEmail
                              }
                            </p>
                          )}

                        </td>

                        {/* Amount */}
                        <td className="px-4 py-4">

                          <p className="text-sm font-semibold text-slate-900">
                            {formatAmount(
                              payment?.amount
                            )}
                          </p>

                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
                          >

                            <StatusIcon
                              size={13}
                            />

                            {config.label}

                          </span>

                        </td>

                        {/* Next Retry */}
                        <td className="px-4 py-4">

                          {payment?.nextRetryAt ? (
                            <div className="flex items-center gap-2">

                              <Clock3
                                size={14}
                                className="text-amber-500"
                              />

                              <span className="text-sm text-slate-600">
                                {formatDate(
                                  payment.nextRetryAt
                                )}
                              </span>

                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}

                        </td>

                        {/* Action */}
                        <td className="px-4 py-4 text-right">

                          {status ===
                            "RETRYING" ? (
                            <span className="text-xs font-medium text-amber-600">
                              Retry scheduled
                            </span>
                          ) : status ===
                            "RECOVERED" ? (
                            <span className="text-xs font-medium text-emerald-600">
                              Recovered
                            </span>
                          ) : status ===
                            "FAILED" ? (
                            <button
                              type="button"
                              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >
                              Retry
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              —
                            </span>
                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

    </div>
  );
}

export default RecoveryAttempts;