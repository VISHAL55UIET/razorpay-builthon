import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function RecentPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * FETCH RECENT PAYMENTS FROM BACKEND
   * ============================================================
   */
  const fetchRecentPayments = async () => {
    try {
      setError("");

      const response = await api.get("/payments/recent");

      setPayments(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Recent payments error:",
        err
      );

      setError(
        "Unable to load recent payments."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */
  useEffect(() => {
    fetchRecentPayments();

    /*
     * Refresh every 30 seconds so dashboard
     * stays updated with latest payment activity.
     */
    const interval = setInterval(() => {
      fetchRecentPayments();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * ============================================================
   * FORMAT AMOUNT
   * ============================================================
   */
  const formatAmount = (amount, currency) => {
    if (
      amount === null ||
      amount === undefined
    ) {
      return "—";
    }

    const value = Number(amount);

    if (Number.isNaN(value)) {
      return `${currency || ""} ${amount}`;
    }

    if (
      String(currency || "INR").toUpperCase() ===
      "INR"
    ) {
      return `₹${value.toLocaleString("en-IN")}`;
    }

    return `${currency || ""} ${value.toLocaleString()}`;
  };

  /*
   * ============================================================
   * FORMAT TIME
   * ============================================================
   */
  const formatTime = (date) => {
    if (!date) {
      return "—";
    }

    const paymentDate = new Date(date);

    if (
      Number.isNaN(
        paymentDate.getTime()
      )
    ) {
      return "—";
    }

    const now = new Date();

    const difference = Math.floor(
      (
        now.getTime() -
        paymentDate.getTime()
      ) / 60000
    );

    if (difference < 1) {
      return "Just now";
    }

    if (difference < 60) {
      return `${difference} min ago`;
    }

    const hours = Math.floor(
      difference / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    return `${days} day${
      days > 1 ? "s" : ""
    } ago`;
  };

  /*
   * ============================================================
   * STATUS
   * ============================================================
   */
  const getStatus = (payment) => {
    const status = String(
      payment?.status || ""
    ).toUpperCase();

    if (
      status === "SUCCESS" ||
      status === "SUCCEEDED" ||
      status === "PAID" ||
      status === "RECOVERED"
    ) {
      return "Recovered";
    }

    if (
      status === "PENDING" ||
      status === "RETRYING" ||
      payment?.nextRetryAt
    ) {
      return "Retry Scheduled";
    }

    if (
      status === "FAILED" ||
      status === "FAILURE"
    ) {
      return "Failed";
    }

    return payment?.status || "Pending";
  };

  /*
   * ============================================================
   * STATUS BADGE
   * ============================================================
   */
  const StatusBadge = ({ status }) => {
    if (status === "Recovered") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={13} />
          Recovered
        </span>
      );
    }

    if (status === "Retry Scheduled") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <Clock3 size={13} />
          Retry Scheduled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
        <XCircle size={13} />
        Failed
      </span>
    );
  };

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */
  const filteredPayments = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return payments;
    }

    return payments.filter((payment) => {
      const paymentId = String(
        payment?.id || ""
      ).toLowerCase();

      const customerId = String(
        payment?.customerId || ""
      ).toLowerCase();

      const customerName = String(
        payment?.customer?.name || ""
      ).toLowerCase();

      const customerEmail = String(
        payment?.customer?.email || ""
      ).toLowerCase();

      const status = String(
        payment?.status || ""
      ).toLowerCase();

      const failureReason = String(
        payment?.failureReason || ""
      ).toLowerCase();

      return (
        paymentId.includes(value) ||
        customerId.includes(value) ||
        customerName.includes(value) ||
        customerEmail.includes(value) ||
        status.includes(value) ||
        failureReason.includes(value)
      );
    });
  }, [payments, search]);

  /*
   * Dashboard par latest 5 payments.
   *
   * Search karne par matching results show honge.
   */
  const visiblePayments =
    filteredPayments.slice(0, 5);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <RefreshCw
            size={18}
            className="animate-spin text-indigo-500"
          />

          <p className="text-sm text-slate-500">
            Loading recent payments...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */
  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchRecentPayments}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ======================================================
          HEADER
          ====================================================== */}
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Recent Payment Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest payment recovery attempts
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/payments")}
          className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          View all
        </button>
      </div>

      {/* ======================================================
          SEARCH
          ====================================================== */}
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="relative max-w-md">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search payments, customers..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* ======================================================
          NO RESULTS
          ====================================================== */}
      {visiblePayments.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-slate-500">
            {search
              ? "No payments found."
              : "No recent payments available."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">

          {/* ==================================================
              TABLE HEADER
              ================================================== */}
          <div className="grid min-w-[1000px] grid-cols-[1.2fr_1.3fr_0.8fr_0.7fr_1fr_0.7fr_30px] border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold tracking-wide text-slate-400">

            <div>
              PAYMENT
            </div>

            <div>
              CUSTOMER
            </div>

            <div>
              AMOUNT
            </div>

            <div>
              METHOD
            </div>

            <div>
              STATUS
            </div>

            <div>
              TIME
            </div>

            <div />
          </div>

          {/* ==================================================
              PAYMENTS
              ================================================== */}
          {visiblePayments.map(
            (payment, index) => {
              const status =
                getStatus(payment);

              const customerName =
                payment?.customer?.name ||
                payment?.customerId ||
                "Unknown customer";

              const customerEmail =
                payment?.customer?.email ||
                "No customer email";

              return (
                <div
                  key={
                    payment?.id ||
                    `payment-${index}`
                  }
                  className="grid min-w-[1000px] grid-cols-[1.2fr_1.3fr_0.8fr_0.7fr_1fr_0.7fr_30px] items-center border-b border-slate-100 px-6 py-4 transition last:border-b-0 hover:bg-slate-50"
                >

                  {/* PAYMENT */}
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {payment?.id
                        ? `#${payment.id}`
                        : "—"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Transaction #
                      {payment?.id ||
                        index + 1}
                    </p>
                  </div>

                  {/* CUSTOMER */}
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {customerName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {customerEmail}
                    </p>
                  </div>

                  {/* AMOUNT */}
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {formatAmount(
                        payment?.amount,
                        payment?.currency
                      )}
                    </p>
                  </div>

                  {/* METHOD */}
                  <div>
                    <span className="text-sm text-slate-400">
                      {payment?.paymentMethod ||
                        payment?.method ||
                        "—"}
                    </span>
                  </div>

                  {/* STATUS */}
                  <div>
                    <StatusBadge
                      status={status}
                    />
                  </div>

                  {/* TIME */}
                  <div>
                    <span className="text-sm text-slate-400">
                      {formatTime(
                        payment?.createdAt ||
                        payment?.updatedAt ||
                        payment?.created_at
                      )}
                    </span>
                  </div>

                  {/* MORE */}
                  <div className="text-center text-slate-400">
                    •••
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default RecentPayments;