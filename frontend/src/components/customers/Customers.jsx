import {
  Users,
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  IndianRupee,
  RefreshCcw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../api/axios'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/payments/recent')

      const payments = response.data || []
      const customerMap = new Map()

      payments.forEach((payment) => {
        const customerId = payment.customerId

        if (!customerId) {
          return
        }

        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            customerId,
            totalPayments: 0,
            successfulPayments: 0,
            failedPayments: 0,
            totalAmount: 0,
          })
        }

        const customer = customerMap.get(customerId)

        customer.totalPayments += 1

        if (
          payment.status === 'success' ||
          payment.status === 'succeeded' ||
          payment.status === 'paid'
        ) {
          customer.successfulPayments += 1
        }

        if (
          payment.status === 'failed' ||
          payment.status === 'failure'
        ) {
          customer.failedPayments += 1
        }

        customer.totalAmount += Number(payment.amount) || 0
      })

      setCustomers(Array.from(customerMap.values()))
    } catch (err) {
      console.error('Customers error:', err)

      setError('Unable to load customers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) =>
    String(customer.customerId)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const totalPayments = customers.reduce(
    (sum, customer) => sum + customer.totalPayments,
    0
  )

  const successfulPayments = customers.reduce(
    (sum, customer) => sum + customer.successfulPayments,
    0
  )

  const failedPayments = customers.reduce(
    (sum, customer) => sum + customer.failedPayments,
    0
  )

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalAmount,
    0
  )

  return (
    <div className="page-container">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={22} />
            </div>

            <div>
              <h1 className="page-title">
                Customers
              </h1>

              <p className="page-subtitle">
                Manage customers and monitor their payment activity.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />

          Refresh
        </button>

      </div>


      {/* ================= SUMMARY ================= */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Customers */}
        <div className="card p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Customers
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {customers.length.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={19} />
            </div>

          </div>

        </div>


        {/* Payments */}
        <div className="card p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Payments
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalPayments.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard size={19} />
            </div>

          </div>

        </div>


        {/* Successful */}
        <div className="card p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Successful
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {successfulPayments.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={19} />
            </div>

          </div>

        </div>


        {/* Revenue */}
        <div className="card p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Revenue
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <IndianRupee size={19} />
            </div>

          </div>

        </div>

      </div>


      {/* ================= SEARCH ================= */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Customer Directory
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredCustomers.length} customers found
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

          </div>

        </div>

      </div>


      {/* ================= LOADING ================= */}
      {loading && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <RefreshCcw
            size={25}
            className="mx-auto animate-spin text-indigo-500"
          />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading customers...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Fetching latest payment activity
          </p>

        </div>
      )}


      {/* ================= ERROR ================= */}
      {!loading && error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-start gap-3">

            <XCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div>
              <p className="text-sm font-semibold text-red-700">
                Failed to load customers
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchCustomers}
                className="mt-3 text-sm font-semibold text-red-700 underline underline-offset-4 hover:text-red-900"
              >
                Try again
              </button>
            </div>

          </div>

        </div>
      )}


      {/* ================= TABLE ================= */}
      {!loading && !error && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Payments
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Successful
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Failed
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Success Rate
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Amount
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredCustomers.map((customer) => {

                  const successRate =
                    customer.totalPayments > 0
                      ? Math.round(
                          (customer.successfulPayments /
                            customer.totalPayments) *
                            100
                        )
                      : 0

                  return (
                    <tr
                      key={customer.customerId}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Customer */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                            {String(customer.customerId)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              {customer.customerId}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Customer ID
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Payments */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <CreditCard
                            size={15}
                            className="text-slate-400"
                          />

                          <span className="text-sm font-semibold text-slate-700">
                            {customer.totalPayments}
                          </span>

                        </div>

                      </td>


                      {/* Successful */}
                      <td className="px-6 py-4">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                          <CheckCircle2 size={13} />

                          {customer.successfulPayments}

                        </span>

                      </td>


                      {/* Failed */}
                      <td className="px-6 py-4">

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">

                          <XCircle size={13} />

                          {customer.failedPayments}

                        </span>

                      </td>


                      {/* Success Rate */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{
                                width: `${successRate}%`,
                              }}
                            />

                          </div>

                          <span className="text-xs font-semibold text-slate-600">
                            {successRate}%
                          </span>

                        </div>

                      </td>


                      {/* Amount */}
                      <td className="px-6 py-4 text-right">

                        <span className="text-sm font-bold text-slate-800">
                          ₹
                          {customer.totalAmount.toLocaleString(
                            'en-IN'
                          )}
                        </span>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>


          {/* Empty */}
          {filteredCustomers.length === 0 && (
            <div className="p-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Users
                  size={22}
                  className="text-slate-400"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                No customers found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try searching with a different customer ID.
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default Customers