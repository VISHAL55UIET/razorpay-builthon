import { useEffect, useState } from 'react'
import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import api from '../../api/axios'

function AIRecoveryInsight() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  // =========================================================
  // Fetch REAL backend AI analytics
  // =========================================================

  const fetchAIInsights = async () => {
    const response = await api.get('/analytics/ai')
    setData(response.data)
  }

  // =========================================================
  // Initial load
  // =========================================================

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true)
        setError('')

        await fetchAIInsights()
      } catch (err) {
        console.error('AI recovery insight error:', err)

        setError(
          err?.response?.data?.message ||
          'Unable to load AI recovery insights.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadInsights()
  }, [])

  // =========================================================
  // Refresh
  // =========================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setError('')

      await fetchAIInsights()
    } catch (err) {
      console.error('AI recovery refresh error:', err)

      setError(
        err?.response?.data?.message ||
        'Unable to refresh AI recovery insights.'
      )
    } finally {
      setRefreshing(false)
    }
  }

  // =========================================================
  // Backend data
  // =========================================================

  const failureAnalysis =
    data?.failureReasonAnalysis || {}

  const analysisEntries =
    Object.entries(failureAnalysis)

  const failedPayments =
    data?.failedPayments ?? 0

  const totalRecoveryAttempts =
    data?.totalRecoveryAttempts ?? 0

  // =========================================================
  // Helpers
  // =========================================================

  const formatAction = (action) => {
    if (!action) {
      return 'No recommendation available'
    }

    return action.replaceAll('_', ' ')
  }

  const formatReason = (reason) => {
    if (!reason) {
      return 'Unknown'
    }

    return reason.replaceAll('_', ' ')
  }

  const formatDate = (date) => {
    if (!date) {
      return null
    }

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleString()
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Brain
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-semibold text-slate-900">
                AI Recovery Insights
              </h2>

              <Sparkles
                size={16}
                className="text-indigo-500"
              />

            </div>

            <p className="mt-1 text-sm text-slate-500">
              AI-powered payment recovery recommendations
            </p>

          </div>

        </div>

        {/* AI status */}

        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 sm:flex">

          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-semibold text-emerald-600">
            AI Active
          </span>

        </div>

      </div>

      {/* ===================================================== */}
      {/* LOADING */}
      {/* ===================================================== */}

      {loading && (

        <div className="mt-6 rounded-xl bg-slate-50 p-6">

          <div className="flex items-center gap-3">

            <RefreshCw
              size={17}
              className="animate-spin text-indigo-500"
            />

            <p className="text-sm text-slate-500">
              Loading AI recovery insights...
            </p>

          </div>

        </div>

      )}

      {/* ===================================================== */}
      {/* ERROR */}
      {/* ===================================================== */}

      {!loading && error && (

        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-5">

          <div className="flex items-start gap-3">

            <AlertTriangle
              size={18}
              className="mt-0.5 text-red-500"
            />

            <div>

              <p className="text-sm font-semibold text-red-700">
                AI insights unavailable
              </p>

              <p className="mt-1 text-xs text-red-500">
                {error}
              </p>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================== */}
      {/* REAL DATA */}
      {/* ===================================================== */}

      {!loading && !error && data && (

        <>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

            {/* Failed Payments */}

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">

                  <XCircle
                    size={16}
                    className="text-red-500"
                  />

                </div>

                <span className="text-xs font-medium text-slate-400">
                  Failed Payments
                </span>

              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {failedPayments}
              </p>

            </div>

            {/* Recovery Attempts */}

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">

                  <Brain
                    size={16}
                    className="text-indigo-500"
                  />

                </div>

                <span className="text-xs font-medium text-slate-400">
                  Recovery Attempts
                </span>

              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalRecoveryAttempts}
              </p>

            </div>

            {/* Categories */}

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">

                  <TrendingUp
                    size={16}
                    className="text-emerald-500"
                  />

                </div>

                <span className="text-xs font-medium text-slate-400">
                  Failure Categories
                </span>

              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {analysisEntries.length}
              </p>

            </div>

          </div>

          {/* ================================================= */}
          {/* REFRESH */}
          {/* ================================================= */}

          <div className="mt-5 flex justify-end">

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              {refreshing
                ? 'Refreshing...'
                : 'Refresh Insights'}

            </button>

          </div>

          {/* ================================================= */}
          {/* FAILURE ANALYSIS */}
          {/* ================================================= */}

          {analysisEntries.length === 0 && (

            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">

              <Brain
                size={26}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No recovery analysis available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Recovery attempt data will appear here once available.
              </p>

            </div>

          )}

          {analysisEntries.length > 0 && (

            <div className="mt-6">

              <div className="mb-4">

                <h3 className="text-sm font-semibold text-slate-900">
                  Recovery Analysis
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Based on actual recovery attempts stored in the database.
                </p>

              </div>

              <div className="space-y-5">

                {analysisEntries.map(
                  ([reason, analysis]) => {

                    const totalAttempts =
                      Number(
                        analysis?.totalAttempts ?? 0
                      )

                    const successful =
                      Number(
                        analysis?.successful ?? 0
                      )

                    const failed =
                      Number(
                        analysis?.failed ?? 0
                      )

                    const pending =
                      Number(
                        analysis?.pending ?? 0
                      )

                    const successRate =
                      Number(
                        analysis?.successRate ?? 0
                      )

                    const action =
                      analysis?.recommendedAction

                    const confidence =
                      Number(
                        analysis?.dataConfidence ?? 0
                      ) * 100

                    return (

                      <div
                        key={reason}
                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-5"
                      >

                        {/* ================================= */}
                        {/* REASON */}
                        {/* ================================= */}

                        <div className="flex items-center justify-between gap-4">

                          <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Failure Reason
                            </p>

                            <h4 className="mt-1 text-sm font-bold uppercase text-slate-900">
                              {formatReason(reason)}
                            </h4>

                          </div>

                          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                            {successRate.toFixed(1)}% success
                          </span>

                        </div>

                        {/* ================================= */}
                        {/* STATS */}
                        {/* ================================= */}

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                          {/* Attempts */}

                          <div className="rounded-lg bg-white p-3">

                            <div className="flex items-center gap-1.5">

                              <Brain
                                size={14}
                                className="text-slate-400"
                              />

                              <span className="text-xs text-slate-400">
                                Attempts
                              </span>

                            </div>

                            <p className="mt-1 text-lg font-semibold text-slate-900">
                              {totalAttempts}
                            </p>

                          </div>

                          {/* Successful */}

                          <div className="rounded-lg bg-white p-3">

                            <div className="flex items-center gap-1.5">

                              <CheckCircle2
                                size={14}
                                className="text-emerald-500"
                              />

                              <span className="text-xs text-slate-400">
                                Successful
                              </span>

                            </div>

                            <p className="mt-1 text-lg font-semibold text-emerald-600">
                              {successful}
                            </p>

                          </div>

                          {/* Failed */}

                          <div className="rounded-lg bg-white p-3">

                            <div className="flex items-center gap-1.5">

                              <XCircle
                                size={14}
                                className="text-red-400"
                              />

                              <span className="text-xs text-slate-400">
                                Failed
                              </span>

                            </div>

                            <p className="mt-1 text-lg font-semibold text-red-500">
                              {failed}
                            </p>

                          </div>

                        </div>

                        {/* ================================= */}
                        {/* PENDING */}
                        {/* ================================= */}

                        <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-3">

                          <div className="flex items-center gap-2">

                            <Clock3
                              size={15}
                              className="text-amber-500"
                            />

                            <span className="text-sm text-slate-500">
                              Pending Recovery
                            </span>

                          </div>

                          <span className="text-sm font-semibold text-slate-900">
                            {pending}
                          </span>

                        </div>

                        {/* ================================= */}
                        {/* RECOMMENDED ACTION */}
                        {/* ================================= */}

                        <div className="mt-4 rounded-lg bg-indigo-50 p-4">

                          <div className="flex items-center gap-2">

                            <Sparkles
                              size={15}
                              className="text-indigo-500"
                            />

                            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                              Recommended Action
                            </p>

                          </div>

                          <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                            {formatAction(action)}
                          </p>

                          {/* Success rate */}

                          <div className="mt-4 flex items-center justify-between">

                            <span className="text-xs text-indigo-500">
                              Historical Success Rate
                            </span>

                            <span className="text-xs font-bold text-indigo-600">
                              {successRate.toFixed(1)}%
                            </span>

                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">

                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    successRate,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                          {/* Data confidence */}

                          <div className="mt-3 flex items-center justify-between">

                            <span className="text-xs text-indigo-400">
                              Data Confidence
                            </span>

                            <span className="text-xs font-semibold text-indigo-500">
                              {confidence.toFixed(0)}%
                            </span>

                          </div>

                        </div>

                      </div>

                    )
                  }
                )}

              </div>

            </div>

          )}

          {/* ================================================= */}
          {/* GENERATED TIME */}
          {/* ================================================= */}

          {data.generatedAt && (

            <div className="mt-6 border-t border-slate-100 pt-4">

              <p className="text-xs text-slate-400">

                Last analysis:{' '}

                <span className="font-medium text-slate-500">
                  {formatDate(data.generatedAt)}
                </span>

              </p>

            </div>

          )}

        </>

      )}

    </div>
  )
}

export default AIRecoveryInsight