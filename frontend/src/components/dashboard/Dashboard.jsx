import { useEffect, useState } from 'react'

import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Users,
  RefreshCw,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Activity,
  Brain,
  Target,
  Zap,
} from 'lucide-react'

import RevenueChart from '../recovery/RevenueChart'
import RecoveryPerformance from '../recovery/RecoveryPerformance'
import RecoveryOverview from '../recovery/RecoveryOverview'
import AIRecoveryInsight from '../dashboard/AIRecoveryInsight'
import RecentPayments from './RecentPayments'

import { getDashboardStats } from '../../services/dashboardService'
import { getRecoveryIntelligence } from '../../api/recoveryIntelligenceApi'
import api from '../../api/axios'


/* =========================================================
   RECOVERY INTELLIGENCE CARD
   ========================================================= */

function RecoveryIntelligenceCard({ paymentId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(paymentId))
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadIntelligence = async () => {
      if (!paymentId) {
        setData(null)
        setLoading(false)
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const result = await getRecoveryIntelligence(paymentId)

        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        console.error('Recovery intelligence error:', err)

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            'Unable to load recovery intelligence.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadIntelligence()

    return () => {
      cancelled = true
    }
  }, [paymentId])

  /* LOADING */

  if (loading) {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Brain size={20} className="animate-pulse" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Recovery Intelligence
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              AI is analyzing the latest failed payment...
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    )
  }

  /* ERROR */

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-red-100 p-2.5 text-red-600">
            <AlertTriangle size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-red-800">
              Recovery Intelligence
            </h3>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  /* NO FAILED PAYMENT */

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
            <Brain size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Recovery Intelligence
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              No failed payment available for analysis.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const score = Number(data.score ?? 0)

  const priority = String(
    data.priority ?? 'MEDIUM'
  ).toUpperCase()

  const action = String(
    data.action ?? 'MANUAL_REVIEW'
  ).replaceAll('_', ' ')

  const successfulPayments =
    data.successfulPayments ?? 0

  const failedPayments =
    data.failedPayments ?? 0

  const priorityClasses = {
    HIGH: 'bg-red-50 text-red-600 border-red-100',
    MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100',
    LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  }

  const actionClasses = {
    RETRY_NOW: 'bg-indigo-600 text-white',
    RETRY_SOON: 'bg-indigo-50 text-indigo-700',
    SEND_REMINDER: 'bg-emerald-50 text-emerald-700',
    MANUAL_REVIEW: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">

      {/* CARD HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Brain size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h3 className="text-base font-bold text-slate-900">
                Recovery Intelligence
              </h3>

              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                AI ACTIVE
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-500">
              AI-assisted recovery recommendation
            </p>
          </div>

        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${
            priorityClasses[priority] ||
            priorityClasses.MEDIUM
          }`}
        >
          {priority} PRIORITY
        </span>

      </div>


      {/* SCORE */}

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">

        <div className="flex flex-col gap-5 md:flex-row md:items-center">

          <div className="flex items-center gap-4">

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">

              <div className="absolute inset-1 rounded-full border-4 border-indigo-100" />

              <div className="relative text-center">

                <div className="text-2xl font-bold text-slate-900">
                  {score}
                </div>

                <div className="text-[10px] font-medium text-slate-400">
                  /100
                </div>

              </div>

            </div>

            <div>

              <div className="flex items-center gap-2">

                <Target
                  size={16}
                  className="text-indigo-600"
                />

                <span className="text-sm font-semibold text-slate-900">
                  Recovery Score
                </span>

              </div>

              <p className="mt-1 text-xs text-slate-500">
                Based on payment & customer history
              </p>

            </div>

          </div>


          {/* SCORE BAR */}

          <div className="flex-1">

            <div className="mb-2 flex items-center justify-between text-xs">

              <span className="font-medium text-slate-500">
                Recovery probability
              </span>

              <span className="font-bold text-indigo-600">
                {score}%
              </span>

            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, score)
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* RECOMMENDED ACTION */}

      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm">
              <Zap size={18} />
            </div>

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Recommended Action
              </p>

              <p className="mt-1 text-base font-bold text-slate-900">
                {action}
              </p>

            </div>

          </div>

          <span
            className={`w-fit rounded-xl px-4 py-2 text-xs font-bold ${
              actionClasses[data.action] ||
              actionClasses.MANUAL_REVIEW
            }`}
          >
            AI Recommendation
          </span>

        </div>

      </div>


      {/* WHY */}

      <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Why this recommendation?
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {data.reason}
        </p>

      </div>


      {/* CUSTOMER HISTORY */}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">

        <div className="rounded-xl border border-slate-200 bg-white p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium text-slate-400">
                Successful Payments
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {successfulPayments}
              </p>

            </div>

            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>

          </div>

        </div>


        <div className="rounded-xl border border-slate-200 bg-white p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium text-slate-400">
                Failed Payments
              </p>

              <p className="mt-1 text-2xl font-bold text-red-500">
                {failedPayments}
              </p>

            </div>

            <div className="rounded-xl bg-red-50 p-2.5 text-red-500">
              <AlertTriangle size={18} />
            </div>

          </div>

        </div>

      </div>


      {/* PAYMENT INFO */}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

        <div>

          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Payment
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {data.paymentId}
          </p>

        </div>

        {data.amount != null && (
          <div className="text-right">

            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Amount
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              ₹{Number(data.amount).toLocaleString('en-IN')}
            </p>

          </div>
        )}

      </div>

    </div>
  )
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {

  const [stats, setStats] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [selectedPeriod, setSelectedPeriod] =
    useState('30')

  const [periodOpen, setPeriodOpen] =
    useState(false)

  const [refreshing, setRefreshing] =
    useState(false)

  const [latestFailedPayment, setLatestFailedPayment] =
    useState(null)


  const periods = [
    {
      value: '7',
      label: 'Last 7 days',
    },
    {
      value: '30',
      label: 'Last 30 days',
    },
    {
      value: '90',
      label: 'Last 90 days',
    },
    {
      value: '365',
      label: 'This year',
    },
  ]


  const selectedPeriodLabel =
    periods.find(
      (period) =>
        period.value === selectedPeriod
    )?.label || 'Last 30 days'


  /* =========================================================
     LOAD DASHBOARD DATA
     ========================================================= */

  const loadDashboard = async () => {

    try {

      setError('')

      const [
        dashboardResponse,
        paymentsResponse,
      ] = await Promise.all([

        getDashboardStats(
          Number(selectedPeriod)
        ),

        api.get('/payments/recent'),

      ])


      setStats(dashboardResponse)


      const payments =
        Array.isArray(paymentsResponse?.data)
          ? paymentsResponse.data
          : Array.isArray(
              paymentsResponse?.data?.content
            )
            ? paymentsResponse.data.content
            : Array.isArray(
                paymentsResponse?.data?.data
              )
              ? paymentsResponse.data.data
              : []


      /*
       * Pick the latest failed payment.
       *
       * This payment ID is sent to:
       *
       * GET /api/recovery-intelligence/{paymentId}
       *
       * through getRecoveryIntelligence().
       */

      const failedPayment =
        payments.find(
          (payment) =>
            String(
              payment?.status || ''
            ).toUpperCase() === 'FAILED'
        )


      setLatestFailedPayment(
        failedPayment || null
      )

    } catch (err) {

      console.error(
        'Dashboard error:',
        err
      )

      setError(
        'Unable to load dashboard data.'
      )

    } finally {

      setLoading(false)
      setRefreshing(false)

    }

  }


  /* =========================================================
     INITIAL LOAD + PERIOD CHANGE
     ========================================================= */

  useEffect(() => {

    loadDashboard()

  }, [selectedPeriod])


  /* =========================================================
     REFRESH
     ========================================================= */

  const handleRefresh = async () => {

    setRefreshing(true)

    await loadDashboard()

  }


  /* =========================================================
     LOADING UI
     ========================================================= */

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-[1500px] px-6 py-8">

          <div className="animate-pulse">

            <div className="h-8 w-56 rounded-lg bg-slate-200" />

            <div className="mt-3 h-4 w-96 rounded bg-slate-200" />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-36 rounded-2xl bg-white shadow-sm"
                  />
                )
              )}

            </div>

          </div>

        </div>

      </div>
    )

  }


  /* =========================================================
     ERROR UI
     ========================================================= */

  if (error) {

    return (
      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-[1500px] px-6 py-10">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <div className="flex items-center gap-3">

              <AlertTriangle
                size={20}
                className="text-red-500"
              />

              <div>

                <h2 className="font-semibold text-red-800">
                  Dashboard unavailable
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={15} />
              Try again
            </button>

          </div>

        </div>

      </div>
    )

  }


  /* =========================================================
     SAFE STATS
     ========================================================= */

  const safeStats = stats || {}

  const totalProcessed =
    safeStats.totalProcessed ?? 0

  const failedPayments =
    safeStats.failedPayments ?? 0

  const successfulPayments =
    safeStats.successfulPayments ?? 0

  const recoveredRevenue =
    safeStats.recoveredRevenue ?? 0

  const recoveryRate =
    safeStats.recoveryRate ?? 0

  const pendingPayments =
    safeStats.pendingPayments ?? 0

  const activeCustomers =
    safeStats.activeCustomers ?? 0


  /* =========================================================
     DASHBOARD UI
     ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-[1500px] px-6 py-8">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Activity
                size={20}
                className="text-indigo-600"
              />

              <span className="text-sm font-semibold text-indigo-600">
                Revenue Intelligence
              </span>

            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Revenue Recovery
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor payment performance and recover more revenue.
            </p>

          </div>


          <div className="flex items-center gap-3">

            {/* PERIOD DROPDOWN */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setPeriodOpen(!periodOpen)
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >

                <Clock3
                  size={16}
                  className="text-slate-400"
                />

                <span>
                  {selectedPeriodLabel}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform ${
                    periodOpen
                      ? 'rotate-180'
                      : ''
                  }`}
                />

              </button>


              {periodOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">

                  {periods.map(
                    (period) => (

                      <button
                        key={period.value}
                        type="button"
                        onClick={() => {

                          setSelectedPeriod(
                            period.value
                          )

                          setPeriodOpen(false)

                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          selectedPeriod ===
                          period.value
                            ? 'bg-indigo-50 font-semibold text-indigo-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >

                        <span>
                          {period.label}
                        </span>

                        {selectedPeriod ===
                          period.value && (
                          <CheckCircle2
                            size={15}
                            className="text-indigo-600"
                          />
                        )}

                      </button>

                    )
                  )}

                </div>
              )}

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>

            </button>

          </div>

        </div>


        {/* =================================================
            TOP METRIC CARDS
            ================================================= */}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            title="Total Payments"
            value={totalProcessed}
            description={`${selectedPeriodLabel} payment volume`}
            icon={CreditCard}
            iconStyle="bg-indigo-50 text-indigo-600"
          />

          <MetricCard
            title="Failed Payments"
            value={failedPayments}
            description="Requires recovery action"
            icon={AlertTriangle}
            iconStyle="bg-amber-50 text-amber-600"
          />

          <MetricCard
            title="Recovered Revenue"
            value={`₹${Number(
              recoveredRevenue
            ).toLocaleString('en-IN')}`}
            description="Successfully recovered"
            icon={CheckCircle2}
            iconStyle="bg-emerald-50 text-emerald-600"
          />

          <MetricCard
            title="Recovery Rate"
            value={`${recoveryRate}%`}
            description="Successful vs failed payments"
            icon={TrendingUp}
            iconStyle="bg-blue-50 text-blue-600"
          />

        </div>


        {/* =================================================
            REVENUE + RECOVERY OVERVIEW
            ================================================= */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.75fr)]">

          {/* REVENUE CHART */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Revenue Performance
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Revenue movement over{' '}
                  {selectedPeriodLabel.toLowerCase()}
                </p>

              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">

                <span className="h-2 w-2 rounded-full bg-indigo-500" />

                Revenue

              </div>

            </div>


            <div className="p-6">

              <RevenueChart
                period={Number(
                  selectedPeriod
                )}
              />

            </div>

          </section>


          {/* RECOVERY OVERVIEW */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Recovery Overview
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Current recovery activity
                </p>

              </div>

              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <CreditCard size={17} />
              </div>

            </div>


            <div className="mt-6">

              <RecoveryOverview />

            </div>

          </section>

        </div>


        {/* =================================================
            AI RECOVERY OPPORTUNITY
            ================================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">

          <div className="border-b border-indigo-50 bg-indigo-50/40 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-sm">
                <Sparkles size={18} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  AI Recovery Opportunity
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  AI-powered recommendations for improving recovery.
                </p>

              </div>

            </div>

          </div>


          <div className="p-6">

            <RecoveryIntelligenceCard
              paymentId={
                latestFailedPayment?.id
              }
            />

          </div>

        </section>


        {/* =================================================
            RECOVERY PERFORMANCE + AI INSIGHTS
            ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* RECOVERY PERFORMANCE */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Recovery Performance
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Recovery success and failure trends
                </p>

              </div>

              <TrendingUp
                size={18}
                className="text-emerald-500"
              />

            </div>


            <div className="mt-6">

              <RecoveryPerformance />

            </div>

          </section>


          {/* AI INSIGHTS */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  AI Insights
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Patterns detected across payment failures
                </p>

              </div>

              <Sparkles
                size={18}
                className="text-indigo-500"
              />

            </div>


            <div className="mt-6">

              <AIRecoveryInsight />

            </div>

          </section>

        </div>


        {/* =================================================
            RECENT PAYMENTS
            ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                Recent Payments
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest payment activity
              </p>

            </div>

            <ArrowUpRight
              size={17}
              className="text-slate-400"
            />

          </div>


          <div className="p-6">

            <RecentPayments />

          </div>

        </section>


        {/* =================================================
            SUMMARY CARDS
            ================================================= */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <SummaryCard
            icon={Users}
            title="Active Customers"
            value={activeCustomers}
            description="Customers with recent activity"
          />

          <SummaryCard
            icon={Clock3}
            title="Pending Recovery"
            value={pendingPayments}
            description="Payments awaiting recovery"
          />

          <SummaryCard
            icon={CheckCircle2}
            title="Successful Payments"
            value={successfulPayments}
            description="Successfully completed payments"
          />

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   METRIC CARD
   ========================================================= */

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconStyle,
}) {

  return (

    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

        </div>


        <div
          className={`rounded-xl p-2.5 ${iconStyle}`}
        >
          <Icon size={18} />
        </div>

      </div>


      <p className="mt-4 text-xs text-slate-400">
        {description}
      </p>

    </div>
  )
}


/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
}) {

  return (

    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
        <Icon size={19} />
      </div>


      <div className="min-w-0">

        <p className="text-xs font-medium text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900">
          {value}
        </p>

        <p className="mt-1 truncate text-xs text-slate-400">
          {description}
        </p>

      </div>

    </div>
  )
}


export default Dashboard