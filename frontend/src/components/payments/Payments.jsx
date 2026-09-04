import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  RefreshCw,
  Filter,
  TrendingUp,
  IndianRupee,
  AlertCircle,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import api from '../../api/axios'
import PaymentButton from './PaymentButton'

function Payments() {
  const [payments, setPayments] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [error, setError] = useState('')

  // Payment success toast
  const [paymentSuccess, setPaymentSuccess] = useState(null)

  const navigate = useNavigate()

  const fetchPayments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      const response = await api.get('/payments/recent')

      setPayments(response.data || [])
    } catch (err) {
      console.error('Payments error:', err)

      setError('Unable to load payments.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  // Listen for successful Razorpay recovery
  useEffect(() => {
    const handlePaymentRecovered = (event) => {
      const paymentId =
        event.detail?.paymentId || ''

      const amount =
        event.detail?.amount || 0

      setPaymentSuccess({
        paymentId,
        amount,
      })

      // Refresh payment list so status becomes RECOVERED
      fetchPayments(true)

      // Automatically hide toast
      setTimeout(() => {
        setPaymentSuccess(null)
      }, 4000)
    }

    window.addEventListener(
      'payment-recovered',
      handlePaymentRecovered
    )

    return () => {
      window.removeEventListener(
        'payment-recovered',
        handlePaymentRecovered
      )
    }
  }, [])

  const normalizeStatus = (status) => {
    return String(status || '')
      .trim()
      .toUpperCase()
  }

  // SUCCESS + RECOVERED are treated as successfully completed payments.
  const isSuccessfulStatus = (status) => {
    const normalized = normalizeStatus(status)

    return (
      normalized === 'SUCCESS' ||
      normalized === 'SUCCEEDED' ||
      normalized === 'PAID' ||
      normalized === 'RECOVERED'
    )
  }

  const isFailedStatus = (status) => {
    const normalized = normalizeStatus(status)

    return (
      normalized === 'FAILED' ||
      normalized === 'FAILURE'
    )
  }

  const getStatusStyle = (status) => {
    const normalized = normalizeStatus(status)

    if (isSuccessfulStatus(normalized)) {
      return {
        container:
          'bg-emerald-50 text-emerald-700 border-emerald-100',
        icon:
          'text-emerald-500',
        Icon:
          CheckCircle2,
      }
    }

    if (isFailedStatus(normalized)) {
      return {
        container:
          'bg-red-50 text-red-700 border-red-100',
        icon:
          'text-red-500',
        Icon:
          XCircle,
      }
    }

    if (
      normalized === 'RETRYING' ||
      normalized === 'RETRY_SCHEDULED'
    ) {
      return {
        container:
          'bg-indigo-50 text-indigo-700 border-indigo-100',
        icon:
          'text-indigo-500',
        Icon:
          RefreshCw,
      }
    }

    return {
      container:
        'bg-amber-50 text-amber-700 border-amber-100',
      icon:
        'text-amber-500',
      Icon:
        Clock3,
    }
  }

  const statistics = useMemo(() => {
    const total = payments.length

    const successful =
      payments.filter((payment) =>
        isSuccessfulStatus(payment.status)
      ).length

    const failed =
      payments.filter((payment) =>
        isFailedStatus(payment.status)
      ).length

    const pending =
      total -
      successful -
      failed

    const totalAmount =
      payments.reduce(
        (sum, payment) => {
          return (
            sum +
            Number(payment.amount || 0)
          )
        },
        0
      )

    const recoveredAmount =
      payments
        .filter((payment) =>
          isSuccessfulStatus(payment.status)
        )
        .reduce(
          (sum, payment) => {
            return (
              sum +
              Number(payment.amount || 0)
            )
          },
          0
        )

    return {
      total,
      successful,
      failed,
      pending,
      totalAmount,
      recoveredAmount,
    }
  }, [payments])

  const filteredPayments =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase()

      return payments.filter(
        (payment) => {
          const matchesSearch =
            !value ||
            String(
              payment.paymentId || ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              payment.customerId || ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              payment.customer?.name || ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              payment.customer?.email || ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              payment.status || ''
            )
              .toLowerCase()
              .includes(value) ||

            String(
              payment.failureReason || ''
            )
              .toLowerCase()
              .includes(value)

          const normalizedStatus =
            normalizeStatus(
              payment.status
            )

          let matchesStatus = true

          if (statusFilter === 'SUCCESS') {
            matchesStatus =
              isSuccessfulStatus(
                normalizedStatus
              )
          } else if (statusFilter === 'FAILED') {
            matchesStatus =
              isFailedStatus(
                normalizedStatus
              )
          } else if (statusFilter === 'PENDING') {
            matchesStatus =
              !isSuccessfulStatus(
                normalizedStatus
              ) &&
              !isFailedStatus(
                normalizedStatus
              )
          }

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      payments,
      search,
      statusFilter,
    ])

  const formatAmount = (amount) => {
    if (amount == null) {
      return '₹0'
    }

    return `₹${Number(
      amount
    ).toLocaleString('en-IN')}`
  }

  const LoadingState = () => {
    return (
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="animate-pulse">
          <div className="h-14 bg-slate-50" />

          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-6 border-t border-slate-100 px-6 py-5"
              >
                <div className="h-9 w-9 rounded-lg bg-slate-200" />

                <div className="h-4 w-40 rounded bg-slate-200" />

                <div className="h-4 w-28 rounded bg-slate-200" />

                <div className="h-4 w-20 rounded bg-slate-200" />

                <div className="h-6 w-20 rounded-full bg-slate-200" />

                <div className="h-4 w-28 rounded bg-slate-200" />
              </div>
            )
          )}
        </div>
      </div>
    )
  }

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass,
    valueClass,
  }) => {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                valueClass ||
                'text-slate-900'
              }`}
            >
              {value}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
          >
            <Icon size={19} />
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          {subtitle}
        </p>
      </div>
    )
  }

  return (
    <div className="page-container">

      {/* ================= PAYMENT SUCCESS TOAST ================= */}

      {paymentSuccess && (
        <div className="fixed right-6 top-6 z-[9999] w-[360px] max-w-[calc(100vw-32px)] animate-[slideIn_.3s_ease-out]">
          <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-2xl">

            <div className="flex items-start gap-3 p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2
                  size={21}
                  className="text-emerald-600"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">
                  Payment Recovered
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Payment successfully verified and recovered.
                </p>

                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  {formatAmount(paymentSuccess.amount)}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPaymentSuccess(null)
                }
                className="text-slate-400 transition hover:text-slate-600"
              >
                ×
              </button>

            </div>

            <div className="h-1 bg-emerald-500" />

          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-2">

            <h1 className="page-title">
              Payments
            </h1>

            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
              Live
            </span>

          </div>

          <p className="page-subtitle">
            Monitor payment transactions,
            failures and recovery activity.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:flex">

            <CreditCard
              size={17}
              className="text-indigo-500"
            />

            <span className="text-sm font-semibold text-slate-600">
              {payments.length}
            </span>

            <span className="text-sm text-slate-400">
              payments
            </span>

          </div>

          <button
            type="button"
            onClick={() =>
              fetchPayments(true)
            }
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              navigate('/payments/recent')
            }
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <CreditCard size={16} />
            Recent Payments
          </button>

        </div>
      </div>

      {/* ================= STATISTICS ================= */}

      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Payments"
            value={statistics.total}
            subtitle="Recent payment transactions"
            icon={CreditCard}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            title="Successful"
            value={statistics.successful}
            subtitle={`${
              statistics.total > 0
                ? (
                    statistics.successful /
                    statistics.total *
                    100
                  ).toFixed(1)
                : 0
            }% success rate`}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
            valueClass="text-emerald-600"
          />

          <StatCard
            title="Failed"
            value={statistics.failed}
            subtitle="Payments requiring recovery"
            icon={XCircle}
            iconClass="bg-red-50 text-red-500"
            valueClass="text-red-500"
          />

          <StatCard
            title="Recovered Revenue"
            value={formatAmount(
              statistics.recoveredAmount
            )}
            subtitle="Successfully recovered amount"
            icon={TrendingUp}
            iconClass="bg-violet-50 text-violet-600"
            valueClass="text-violet-600"
          />

        </div>
      )}

      {/* ================= SEARCH + FILTER ================= */}

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:max-w-md">

          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search payment, customer, status..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
          />

        </div>

        <div className="flex items-center gap-2 overflow-x-auto">

          <div className="flex items-center gap-2 text-sm text-slate-400">

            <Filter size={15} />

            <span className="hidden sm:block">
              Status
            </span>

          </div>

          {[
            ['ALL', 'All'],
            ['SUCCESS', 'Successful'],
            ['FAILED', 'Failed'],
            ['PENDING', 'Pending'],
          ].map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    value
                  )
                }
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  statusFilter === value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            )
          )}

        </div>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <LoadingState />
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircle size={18} />
            </div>

            <div>

              <p className="text-sm font-semibold text-red-700">
                Unable to load payments
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  fetchPayments()
                }
                className="mt-3 text-sm font-semibold text-red-700 underline underline-offset-2"
              >
                Try again
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= TABLE ================= */}

      {!loading && !error && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

            <div>

              <h2 className="text-sm font-semibold text-slate-900">
                Recent Transactions
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Showing {filteredPayments.length}
                {' '}
                of {payments.length} payments
              </p>

            </div>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch('')
                }
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear search
              </button>
            )}

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead className="border-b border-slate-100 bg-slate-50/80">

                <tr>

                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Payment
                  </th>

                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Failure Reason
                  </th>

                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredPayments.map(
                  (payment, index) => {

                    const status =
                      getStatusStyle(
                        payment.status
                      )

                    const StatusIcon =
                      status.Icon

                    const normalizedStatus =
                      normalizeStatus(
                        payment.status
                      )

                    const isFailed =
                      isFailedStatus(
                        normalizedStatus
                      )

                    const isRecovered =
                      isSuccessfulStatus(
                        normalizedStatus
                      )

                    return (
                      <tr
                        key={
                          payment.id ||
                          payment._id ||
                          index
                        }
                        className="group transition hover:bg-slate-50/70"
                      >

                        {/* PAYMENT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">

                              <CreditCard
                                size={17}
                              />

                            </div>

                            <div>

                              <p className="text-sm font-semibold text-slate-800">

                                {payment.paymentId ||
                                  `PAY-${
                                    payment.id ||
                                    index + 1
                                  }`}

                              </p>

                              <p className="mt-1 text-xs text-slate-400">

                                Transaction #
                                {payment.id ||
                                  index + 1}

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td className="px-6 py-5">

                          <div>

                            <p className="text-sm font-medium text-slate-700">

                              {payment.customer?.name ||
                                payment.customerId ||
                                'Unknown customer'}

                            </p>

                            <p className="mt-1 max-w-[210px] truncate text-xs text-slate-400">

                              {payment.customer?.email ||
                                payment.customerId ||
                                'No customer email'}

                            </p>

                          </div>

                        </td>

                        {/* AMOUNT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-1">

                            <IndianRupee
                              size={14}
                              className="text-slate-400"
                            />

                            <span className="text-sm font-bold text-slate-800">

                              {payment.amount != null
                                ? Number(
                                    payment.amount
                                  ).toLocaleString(
                                    'en-IN'
                                  )
                                : 'N/A'}

                            </span>

                          </div>

                          <p className="mt-1 text-xs uppercase text-slate-400">

                            {payment.currency ||
                              'INR'}

                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.container}`}
                          >

                            <StatusIcon
                              size={13}
                              className={
                                status.icon
                              }
                            />

                            {normalizedStatus ===
                            'RECOVERED'
                              ? 'RECOVERED'
                              : payment.status ||
                                'PENDING'}

                          </span>

                        </td>

                        {/* FAILURE REASON */}

                        <td className="px-6 py-5">

                          {payment.failureReason ? (

                            <div className="flex items-center gap-2">

                              <div className="h-2 w-2 rounded-full bg-red-400" />

                              <span className="text-sm capitalize text-slate-500">

                                {String(
                                  payment.failureReason
                                ).replaceAll(
                                  '_',
                                  ' '
                                )}

                              </span>

                            </div>

                          ) : (

                            <span className="text-sm text-slate-300">
                              —
                            </span>

                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">

                          {isFailed ? (

                            <PaymentButton
                              paymentId={
                                payment.id
                              }
                              amount={
                                payment.amount
                              }
                              customerName={
                                payment.customer?.name ||
                                ''
                              }
                              customerEmail={
                                payment.customer?.email ||
                                ''
                              }
                            />

                          ) : isRecovered ? (

                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">

                              <CheckCircle2
                                size={14}
                              />

                              Recovered

                            </span>

                          ) : (

                            <span className="text-xs text-slate-300">
                              —
                            </span>

                          )}

                        </td>

                      </tr>
                    )
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* EMPTY STATE */}

          {filteredPayments.length === 0 && (

            <div className="border-t border-slate-100 px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">

                <Search size={20} />

              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No payments found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or
                status filter.
              </p>

              {(search ||
                statusFilter !== 'ALL') && (

                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('ALL')
                  }}
                  className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Clear filters
                </button>

              )}

            </div>

          )}

        </div>
      )}

    </div>
  )
}

export default Payments