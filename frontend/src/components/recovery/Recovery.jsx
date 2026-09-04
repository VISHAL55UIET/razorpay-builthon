import {
  ArrowLeft,
  RefreshCcw,
  Activity,
  ShieldCheck,
  Clock3,
} from 'lucide-react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import RecoverySummary from './RecoverySummary.jsx'
import RecoveryOverview from './RecoveryOverview.jsx'
import RecoveryPerformance from './RecoveryPerformance.jsx'
import RevenueChart from './RevenueChart.jsx'
import RecoveryAttempts from './RecoveryAttempts.jsx'


function Recovery() {

  const navigate = useNavigate()

  const [refreshing, setRefreshing] =
    useState(false)

  const [lastUpdated, setLastUpdated] =
    useState(new Date())

const handleRefresh = () => {
  setRefreshing(true)
  window.location.reload()
}
  const formattedTime =
    lastUpdated.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  return (
    <div className="page-container">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            title="Back to Dashboard"
          >
            <ArrowLeft size={17} />
          </button>

          {/* Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="page-title">
                Recovery
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                Recovery Engine Active

              </span>

            </div>


            <p className="page-subtitle">

              Monitor failed payments,
              automated retries and recovered revenue.

            </p>

          </div>

        </div>
        <div className="flex items-center gap-3">

          {/* Last updated */}

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm md:flex">

            <Clock3
              size={15}
              className="text-slate-400"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Last updated
              </p>
              <p className="text-xs font-semibold text-slate-600">
                {formattedTime}
              </p>
            </div>
          </div>
          {/* System status */}
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Activity size={15} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                System
              </p>
              <p className="text-xs font-semibold text-slate-700">
                Operational
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCcw
              size={16}
              className={
                refreshing
                  ? 'animate-spin'
                  : ''
              }
            />

            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}

          </button>

        </div>

      </div>
      <section className="mt-7">

        <div className="mb-4 flex items-center gap-2">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">

            <Activity size={14} />

          </div>

          <div>

            <h2 className="text-sm font-semibold text-slate-900">
              Recovery Overview
            </h2>

            <p className="text-xs text-slate-400">
              Current recovery performance
            </p>

          </div>

        </div>


        <RecoverySummary />

      </section>
      <section className="mt-7">

        <div className="mb-4 flex items-center gap-2">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

            <ShieldCheck size={14} />

          </div>

          <div>

            <h2 className="text-sm font-semibold text-slate-900">
              Recovery Performance
            </h2>

            <p className="text-xs text-slate-400">
              Success rate and recovery activity
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          <div className="min-w-0 xl:col-span-1">

            <RecoveryOverview />

          </div>


          <div className="min-w-0 xl:col-span-2">

            <RecoveryPerformance />

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* REVENUE */}
      {/* ================================================= */}

      <section className="mt-7">

        <div className="mb-4">

          <h2 className="text-sm font-semibold text-slate-900">
            Revenue Recovery
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Revenue recovered through payment recovery attempts
          </p>

        </div>


        <RevenueChart />

      </section>


      {/* ================================================= */}
      {/* RECOVERY ATTEMPTS */}
      {/* ================================================= */}

      <section className="mt-7 pb-6">

        <div className="mb-4">

          <h2 className="text-sm font-semibold text-slate-900">
            Recovery Attempts
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Latest automated recovery activity
          </p>

        </div>
        <RecoveryAttempts />
      </section>
    </div>
)
}
export default Recovery