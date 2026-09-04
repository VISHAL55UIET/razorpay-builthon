import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  XCircle,
} from 'lucide-react'
import api from '../../api/axios'

function StatusBadge({ status }) {

  if (status === 'Recovered') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        Recovered
      </span>
    )
  }

  if (status === 'Retry Scheduled') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock3 size={13} />
        Retry Scheduled
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
      <XCircle size={13} />
      Failed
    </span>
  )
}

function RecentPayment() {

  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const fetchRecentPayments = async () => {

      try {

        setLoading(true)
        setError('')

        const response = await api.get('/payments/recent')

        setPayments(response.data)

      } catch (err) {

        console.error(
          'Recent payments error:',
          err
        )

        setError(
          'Unable to load recent payments.'
        )

      } finally {

        setLoading(false)

      }
    }

    fetchRecentPayments()

  }, [])

  const formatAmount = (amount, currency) => {

    if (
      amount === null ||
      amount === undefined
    ) {
      return '—'
    }

    if (currency === 'INR') {
      return `₹${Number(
        amount
      ).toLocaleString('en-IN')}`
    }

    return `${currency || ''} ${Number(
      amount
    ).toLocaleString()}`
  }

  const formatTime = (date) => {

    if (!date) {
      return '—'
    }

    const paymentDate = new Date(date)

    if (
      Number.isNaN(
        paymentDate.getTime()
      )
    ) {
      return '—'
    }

    const now = new Date()

    const difference = Math.floor(
      (
        now.getTime() -
        paymentDate.getTime()
      ) / 60000
    )

    if (difference < 1) {
      return 'Just now'
    }

    if (difference < 60) {
      return `${difference} min ago`
    }

    const hours = Math.floor(
      difference / 60
    )

    if (hours < 24) {
      return `${hours} hr ago`
    }

    const days = Math.floor(
      hours / 24
    )

    return `${days} day${
      days > 1 ? 's' : ''
    } ago`
  }

  const getStatus = (payment) => {

    if (
      payment.status === 'SUCCESS' ||
      payment.status === 'RECOVERED'
    ) {
      return 'Recovered'
    }

    if (
      payment.status === 'PENDING' ||
      payment.nextRetryAt
    ) {
      return 'Retry Scheduled'
    }

    if (
      payment.status === 'FAILED'
    ) {
      return 'Failed'
    }

    return payment.status || 'Failed'
  }

  const getPaymentId = (payment) => {

    if (payment.paymentId) {
      return `#${payment.paymentId}`
    }

    if (payment.id) {
      return `#PAY-${payment.id}`
    }

    return '—'
  }

  const getCustomerName = (payment) => {

    if (payment.customer?.name) {
      return payment.customer.name
    }

    if (payment.customerName) {
      return payment.customerName
    }

    if (payment.customerId) {
      return payment.customerId
    }

    return 'Unknown customer'
  }

  const getCustomerEmail = (payment) => {

    if (payment.customer?.email) {
      return payment.customer.email
    }

    if (payment.email) {
      return payment.email
    }

    return '—'
  }

  const getPaymentMethod = (payment) => {

    if (payment.paymentMethod) {
      return payment.paymentMethod
    }

    if (payment.method) {
      return payment.method
    }

    return '—'
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Recent Payment Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest payment recovery attempts
          </p>

        </div>

        <button
          type="button"
          className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
        >
          View all
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead>

            <tr className="border-b border-slate-100 bg-slate-50/60 text-left">

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Payment
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Amount
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Method
              </th>

              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Time
              </th>

              <th className="w-10 px-4 py-3" />

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  Loading recent payments...
                </td>

              </tr>

            ) : payments.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  No recent payments found.
                </td>

              </tr>

            ) : (

              payments
                .slice(0, 5).map((payment) => {
                  const status =
                  getStatus(payment)
                  return (
                    <tr
                      key={
                        payment.id ||
                        payment.paymentId
                      }
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                    >

                      {/* Payment */}
                      <td className="px-6 py-4">

                        <span className="text-sm font-semibold text-slate-800">
                          {getPaymentId(payment)}
                        </span>

                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">

                        <div>

                          <p className="text-sm font-medium text-slate-800">
                            {getCustomerName(payment)}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {getCustomerEmail(payment)}
                          </p>

                        </div>

                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">

                        <span className="text-sm font-semibold text-slate-800">
                          {formatAmount(
                            payment.amount,
                            payment.currency
                          )}
                        </span>

                      </td>

                      {/* Payment Method */}
                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-500">
                          {getPaymentMethod(payment)}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                        <StatusBadge
                          status={status}
                        />

                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 text-right">

                        <span className="text-xs text-slate-400">
                          {formatTime(
                            payment.updatedAt ||
                            payment.createdAt
                          )}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">

                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreHorizontal
                            size={17}
                          />
                        </button>

                      </td>

                    </tr>
                  )

                })

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default RecentPayment