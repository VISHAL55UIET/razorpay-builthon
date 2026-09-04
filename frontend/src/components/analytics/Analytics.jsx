import { useEffect, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  IndianRupee,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import api from '../../api/axios'

function Analytics() {
  const [revenueData, setRevenueData] = useState([])
  const [recoveryData, setRecoveryData] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          revenueResponse,
          recoveryResponse,
        ] = await Promise.all([
          api.get('/analytics/revenue'),
          api.get('/analytics/recovery'),
        ])

        setRevenueData(
          revenueResponse.data || []
        )

        setRecoveryData(
          recoveryResponse.data || {}
        )
      } catch (error) {
        console.error(
          'Analytics error:',
          error
        )

        setError(
          'Unable to load analytics data.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const totalRecoveryAttempts =
    Number(
      recoveryData?.totalRecoveryAttempts || 0
    )

  const recoveredRevenue =
    Number(
      recoveryData?.recoveredRevenue || 0
    )

  const recoverySuccessRate =
    Number(
      recoveryData?.recoverySuccessRate || 0
    )

  const successfulRecoveryAttempts =
    Number(
      recoveryData?.successfulRecoveryAttempts || 0
    )

  const pendingRecoveryAttempts =
    Number(
      recoveryData?.pendingRecoveryAttempts || 0
    )

  const failedRecoveryAttempts =
    Number(
      recoveryData?.failedRecoveryAttempts || 0
    )

  const stats = [
    {
      title: 'Recovery Attempts',
      value:
        totalRecoveryAttempts.toLocaleString(
          'en-IN'
        ),
      icon: CreditCard,
      iconClass:
        'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Recovered Revenue',
      value: `₹${recoveredRevenue.toLocaleString(
        'en-IN'
      )}`,
      icon: IndianRupee,
      iconClass:
        'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Recovery Success Rate',
      value: `${recoverySuccessRate.toFixed(1)}%`,
      icon: TrendingUp,
      iconClass:
        'bg-blue-50 text-blue-600',
    },
    {
      title: 'Successful Recoveries',
      value:
        successfulRecoveryAttempts.toLocaleString(
          'en-IN'
        ),
      icon: CheckCircle2,
      iconClass:
        'bg-green-50 text-green-600',
    },
  ]

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading analytics...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <BarChart3
                size={20}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h1 className="page-title">
                Analytics
              </h1>

              <p className="page-subtitle">
                Analyze payment performance and revenue recovery.
              </p>
            </div>

          </div>
        </div>

        <select
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          <option>
            Last 7 months
          </option>

          <option>
            Last 90 days
          </option>

          <option>
            Last 30 days
          </option>
        </select>

      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    {item.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  <Icon size={19} />
                </div>

              </div>

            </div>
          )
        })}

      </div>

      {/* Revenue Chart */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-semibold text-slate-900">
            Revenue Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Total revenue compared with recovered revenue.
          </p>

        </div>

        <div className="h-[320px]">

          {revenueData.length === 0 ? (

            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-500">
                No revenue data available.
              </p>
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="analyticsRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.22}
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
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#64748b',
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#64748b',
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    `₹${value / 1000}k`
                  }
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border:
                      '1px solid #e2e8f0',
                    boxShadow:
                      '0 10px 30px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value, name) => [
                    `₹${Number(
                      value
                    ).toLocaleString('en-IN')}`,
                    name === 'revenue'
                      ? 'Total Revenue'
                      : 'Recovered Revenue',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#analyticsRevenue)"
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

      </div>

      {/* Recovery Breakdown */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recovery Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Recovery Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current recovery pipeline breakdown.
            </p>

          </div>

          <div className="space-y-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />
                </div>

                <span className="text-sm text-slate-600">
                  Recovered
                </span>

              </div>

              <span className="font-semibold text-slate-900">
                {successfulRecoveryAttempts}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                  <TrendingUp
                    size={18}
                    className="text-amber-600"
                  />
                </div>

                <span className="text-sm text-slate-600">
                  Pending
                </span>

              </div>

              <span className="font-semibold text-slate-900">
                {pendingRecoveryAttempts}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                  <XCircle
                    size={18}
                    className="text-red-600"
                  />
                </div>

                <span className="text-sm text-slate-600">
                  Failed
                </span>

              </div>

              <span className="font-semibold text-slate-900">
                {failedRecoveryAttempts}
              </span>

            </div>

          </div>

        </div>

        {/* Recovery Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Recovery Efficiency
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              How effectively failed payments are being recovered.
            </p>

          </div>

          <div className="flex items-center justify-center py-8">

            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-indigo-100">

              <div
                className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-t-indigo-600"
                style={{
                  transform: `rotate(${recoverySuccessRate * 3.6}deg)`,
                }}
              />

              <div className="text-center">

                <p className="text-3xl font-bold text-slate-900">
                  {recoverySuccessRate.toFixed(1)}%
                </p>

                <p className="text-xs text-slate-400">
                  success rate
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Analytics