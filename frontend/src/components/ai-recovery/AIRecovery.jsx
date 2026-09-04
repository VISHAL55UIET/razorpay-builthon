import { useEffect, useState } from 'react'

import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Play,
} from 'lucide-react'

import api from '../../api/axios'


function AIRecovery() {

  const [payments, setPayments] = useState([])

  const [insights, setInsights] = useState([])

  // Saga state per payment
  const [sagas, setSagas] = useState({})

  const [loading, setLoading] = useState(true)

  const [generating, setGenerating] =
    useState(false)

  const [sagaLoading, setSagaLoading] =
    useState({})

  const [resumeLoading, setResumeLoading] =
    useState({})

  const [error, setError] =
    useState('')


  // =========================================================
  // INITIAL DATA
  // =========================================================

  useEffect(() => {

    fetchInitialData()

  }, [])


  // =========================================================
  // FETCH INITIAL DATA
  // =========================================================

  const fetchInitialData = async () => {

    try {

      setLoading(true)

      setError('')


      const [
        paymentsResponse,
        aiResponse,
      ] = await Promise.all([

        api.get('/payments'),

        api.get('/analytics/ai'),

      ])


      // =====================================================
      // PAYMENTS
      // =====================================================

      const paymentData =
        paymentsResponse.data


      let paymentList = []


      if (Array.isArray(paymentData)) {

        paymentList =
          paymentData

      } else if (
        Array.isArray(
          paymentData?.content
        )
      ) {

        paymentList =
          paymentData.content

      } else if (
        Array.isArray(
          paymentData?.data
        )
      ) {

        paymentList =
          paymentData.data

      } else if (paymentData) {

        paymentList =
          [paymentData]

      }


      setPayments(paymentList)


      // =====================================================
      // LOAD EXISTING SAGAS
      // =====================================================

      await loadExistingSagas(
        paymentList
      )


      // =====================================================
      // SAVED AI INSIGHTS
      // =====================================================

      const aiData =
        aiResponse.data


      const savedInsights =
        Array.isArray(
          aiData?.insights
        )
          ? aiData.insights
          : []


      setInsights(
        savedInsights
      )


    } catch (err) {

      console.error(
        'Initial AI recovery loading error:',
        err
      )


      setError(

        err?.response?.data?.message ||

        'Unable to load AI recovery data.'

      )


    } finally {

      setLoading(false)

    }

  }


  // =========================================================
  // LOAD EXISTING SAGAS FROM DATABASE
  // =========================================================

  const loadExistingSagas =
    async (paymentList) => {

      if (!Array.isArray(paymentList)) {

        console.warn(
          'Invalid payment list:',
          paymentList
        )

        setSagas({})

        return

      }


      const failedPayments =
        paymentList.filter(

          (payment) =>

            String(
              payment?.status
            ).toUpperCase() ===
            'FAILED'

        )


      if (
        failedPayments.length === 0
      ) {

        setSagas({})

        return

      }


      const sagaResults =
        await Promise.all(

          failedPayments.map(
            async (payment) => {

              try {

                const response =
                  await api.get(
                    `/ai-recovery/saga/${payment.id}`
                  )


                return {

                  paymentId:
                    payment.id,

                  saga:
                    response.data,

                }

              } catch (error) {

                console.warn(

                  `Unable to load saga for payment ${payment.id}`,

                  error

                )


                return null

              }

            }
          )

        )


      const sagaMap = {}


      sagaResults

        .filter(Boolean)

        .forEach(
          ({
            paymentId,
            saga,
          }) => {

            if (

              saga &&

              saga.status !==
                'NOT_FOUND'

            ) {

              sagaMap[paymentId] =
                saga

            }

          }
        )
      setSagas(
        sagaMap
      )
    }

  const generateAIResponse =
    async (payment) => {
      try {
        setGenerating(true)
        setError('')
        const response =
          await api.post(
            `/ai-recovery/execute/${payment.id}`
          )
        const responseData =
          response.data
        let generatedResults = []
        if (
          Array.isArray(
            responseData
          )
        ) {
          generatedResults =
            responseData

        } else if (
          Array.isArray(
            responseData?.results
          )
        ) {

          generatedResults =
            responseData.results

        } else if (
          responseData
        ) {

          generatedResults =
            [responseData]

        }


        const resultsWithPayment =
          generatedResults.map(
            (result) => ({

              ...result,

              payment,

            })
          )


        setInsights(
          (previous) => {

            const filtered =
              previous.filter(

                (item) =>

                  String(

                    item.paymentDatabaseId ??

                    item.payment?.id ??

                    item.paymentId

                  ) !==
                  String(payment.id)

              )
            return [
              ...filtered,
              ...resultsWithPayment,

            ]
          }
        )

        try {
          const savedResponse =
            await api.get(
              '/analytics/ai'
            )

          const savedData =
            savedResponse.data
          if ( Array.isArray( savedData?.insights  )) {
            setInsights(
              savedData.insights
            )
          }
        } catch (
          reloadError
        ) {
          console.warn(
            'Unable to reload persisted AI insights:',
            reloadError
          )
        }
      } catch (err) {
        console.error(
          'AI recovery generation error:',
          err
        )
        setError(
          err?.response?.data?.message ||
          err?.response?.data ||
          'Unable to generate AI recovery response.'
        )
      } finally {
        setGenerating(false)
      }
    }
  const executeSaga =
    async (payment) => {
      const paymentId =
        payment?.id

      if (!paymentId) {
        setError(
          'Invalid payment ID.'
        )
        return
      }
      try {
        setSagaLoading(
          (previous) => ({
            ...previous,
            [paymentId]:
              true,
          })
        )
        setError('')
        const response =
          await api.post(
            `/ai-recovery/saga/${paymentId}`
          )
        const sagaResult =
          response.data
        setSagas(
          (previous) => ({
            ...previous,
            [paymentId]:
              sagaResult,

          })
        )
        try {
          const aiResponse =
            await api.get( '/analytics/ai'
            )
          const aiData =aiResponse.data
          if (
           Array.isArray(
            aiData?.insights )  ) {
            setInsights(
            aiData.insights )
          }

        } catch (
          reloadError
        ) {

          console.warn(

            'Unable to reload AI insights:',

            reloadError

          )

        }
        try {
          const sagaResponse =
            await api.get(
              `/ai-recovery/saga/${paymentId}`

            )

          if (
            sagaResponse.data &&
            sagaResponse.data.status !==
              'NOT_FOUND'
          ) {

            setSagas(
              (previous) => ({
                ...previous,
                [paymentId]:
                  sagaResponse.data,

              })
            )
          }
        } catch (
          sagaReloadError
        ) {
          console.warn(
            'Unable to reload saga:',
            sagaReloadError

          )
        }
      } catch (err) {
        console.error(
          'Saga execution error:',
          err
        )
        setError(
          err?.response?.data?.message ||
          err?.response?.data ||
          'Unable to execute recovery saga.'
        )

      } finally {
        setSagaLoading(
          (previous) => ({
            ...previous,
            [paymentId]:
              false,

          })
        )
      }

    }

  const resumeSaga =
    async (payment) => {
      const paymentId =
        payment?.id
      if (!paymentId) {
        setError(
          'Invalid payment ID.'
        )
        return
      }
      try {
       setResumeLoading(
          (previous) => ({

           ...previous,
            [paymentId]:
              true,

          })
        )
        setError('')
        const response =
          await api.post(
            `/ai-recovery/saga/${paymentId}/resume`

          )
        const sagaResult =response.data
        setSagas(
          (previous) => ({
            ...previous,
            [paymentId]:
              sagaResult,
          })
        )
        try {
          const aiResponse =
            await api.get(
              '/analytics/ai'
            )
          const aiData =
            aiResponse.data
          if (
            Array.isArray(
              aiData?.insights
            )
          ) {

            setInsights(
              aiData.insights
            )

          }

        } catch (
          reloadError
        ) {

          console.warn(
            'Unable to reload AI insights:',
            reloadError

          )

        }
        try {
          const sagaResponse =
            await api.get(
              `/ai-recovery/saga/${paymentId}`
            )
          if (
            sagaResponse.data &&
            sagaResponse.data.status !==
              'NOT_FOUND'
          ) {

            setSagas(
              (previous) => ({

                ...previous,

                [paymentId]:
                  sagaResponse.data,

              })
            )

          }

        } catch (
          sagaReloadError
        ) {

          console.warn(

            'Unable to reload saga after resume:',

            sagaReloadError

          )

        }


      } catch (err) {

        console.error(

          'Saga resume error:',

          err

        )


        setError(

          err?.response?.data?.message ||

          err?.response?.data ||

          'Unable to resume recovery saga.'

        )


      } finally {

        setResumeLoading(
          (previous) => ({

            ...previous,

            [paymentId]:
              false,

          })
        )

      }

    }

  const handleRefresh =
    async () => {

      await fetchInitialData()

    }

  const formatReason =
    (reason) => {

      if (!reason) {

        return 'UNKNOWN'

      }

      return String(reason)
        .replaceAll(
          '_',
          ' '
        )

    }


  const formatAction =
    (action) => {

      if (!action) {

        return 'No action available'

      }


      return String(action)
        .replaceAll(
          '_',
          ' '
        )

    }


  const getPaymentId =
    (insight) => {

      return (

        insight?.paymentDatabaseId ??

        insight?.payment?.id ??

        insight?.paymentId

      )

    }


  const getRecommendation =
    (insight) => {

      return (

        insight?.aiRecommendation ??

        insight?.recommendation ??

        insight?.message ??

        'No AI recommendation available.'

      )

    }


  const getConfidence =
    (insight) => {

      const value =
        Number(
          insight?.aiConfidence ?? 0
        )


      if (value <= 1) {

        return value * 100

      }


      return value

    }

  const getSagaStatus =
    (paymentId) => {

      return sagas?.[paymentId]?.status

    }
  const getSagaStep =
    (paymentId) => {

      const saga =
        sagas?.[paymentId]


      return (

        saga?.currentStep ??

        saga?.resumedFrom ??

        'UNKNOWN'

      )

    }


  const getSagaAction =
    (paymentId) => {

      const saga =
        sagas?.[paymentId]


      return (

        saga?.action ??

        'No action available'

      )

    }


  const getSagaResult =
    (paymentId) => {

      const saga =
        sagas?.[paymentId]


      return (

        saga?.executionResult?.result ??

        saga?.executionResult?.status ??

        saga?.result ??

        (
          String(
            saga?.status
          ).toUpperCase() ===
          'ALREADY_COMPLETED'

            ? 'ALREADY_COMPLETED'

            : saga?.status ??
              'No result available'
        )

      )

    }


  const isSagaCompleted =
    (paymentId) => {

      const status =
        String(

          getSagaStatus(
            paymentId
          ) || ''

        ).toUpperCase()


      return (

        status === 'COMPLETED' ||

        status === 'ALREADY_COMPLETED'

      )

    }


  const isSagaFailed =
    (paymentId) => {

      return (

        String(

          getSagaStatus(
            paymentId
          ) || ''

        ).toUpperCase() ===
        'FAILED'

      )

    }


  if (loading) {

    return (

      <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <RefreshCw
            size={18}
            className="animate-spin text-indigo-500"
          />

          <p className="text-sm text-slate-500">

            Loading AI recovery data...

          </p>

        </div>

      </div>

    )

  }


  return (

    <div className="space-y-6">

      <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <Brain
                size={21}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-xl font-semibold text-slate-900">

                  AI Recovery

                </h1>


                <Sparkles
                  size={17}
                  className="text-indigo-500"
                />

              </div>


              <p className="mt-1 text-sm text-slate-500">

                Analyze failed payments and generate AI-powered recovery decisions.

              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >

            <RefreshCw
              size={14}
            />

            Refresh

          </button>

        </div>

      </div>

      {error && (

        <div className="rounded-xl border border-red-100 bg-red-50 p-4">

          <div className="flex items-start gap-3">

            <AlertTriangle
              size={18}
              className="mt-0.5 text-red-500"
            />
            <div>

              <p className="text-sm font-semibold text-red-700">

                AI Recovery Error

              </p>


              <p className="mt-1 text-xs text-red-500">

                {String(error)}

              </p>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================== */}
      {/* PAYMENTS */}
      {/* ===================================================== */}

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-slate-900">

            Failed Payments

          </h2>


          <p className="mt-1 text-sm text-slate-500">

            Analyze failed payments and execute recovery through the Saga workflow.

          </p>

        </div>


        {payments.length === 0 && (

          <div className="rounded-xl bg-slate-50 p-6 text-center">

            <CreditCard
              size={28}
              className="mx-auto text-slate-300"
            />


            <p className="mt-3 text-sm font-medium text-slate-600">

              No payments available.

            </p>

          </div>

        )}


        {payments.length > 0 && (

          <div className="space-y-3">

            {payments.map(
              (payment) => {

                const paymentId =
                  payment?.id


                const paymentStatus =
                  payment?.status


                const failureReason =
                  payment?.failureReason


                const existingInsight =
                  insights.find(

                    (insight) =>

                      String(
                        getPaymentId(
                          insight
                        )
                      ) ===
                      String(
                        paymentId
                      )

                  )


                const saga =
                  sagas?.[paymentId]


                const sagaStatus =
                  getSagaStatus(
                    paymentId
                  )


                const sagaFailed =
                  isSagaFailed(
                    paymentId
                  )


                const sagaCompleted =
                  isSagaCompleted(
                    paymentId
                  )


                return (

                  <div
                    key={paymentId}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                  >

                    {/* PAYMENT HEADER */}

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500">

                          <CreditCard
                            size={17}
                          />

                        </div>


                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                            Payment

                          </p>


                          <p className="mt-1 text-sm font-bold text-slate-900">

                            {payment?.paymentId ||
                              `#${paymentId}`}

                          </p>


                          <div className="mt-2 flex flex-wrap items-center gap-2">

                            {paymentStatus && (

                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">

                                {formatReason(
                                  paymentStatus
                                )}

                              </span>

                            )}


                            {failureReason && (

                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">

                                {formatReason(
                                  failureReason
                                )}

                              </span>

                            )}

                          </div>

                        </div>

                      </div>


                      {/* ACTION BUTTONS */}

                      <div className="flex flex-wrap items-center gap-2">


                        {/* AI */}

                        <button
                          type="button"
                          disabled={
                            generating
                          }
                          onClick={() =>
                            generateAIResponse(
                              payment
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {generating ? (

                            <>

                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />

                              Generating...

                            </>

                          ) : (

                            <>

                              <Sparkles
                                size={15}
                              />

                              {existingInsight
                                ? 'Regenerate AI'
                                : 'Generate AI'}

                            </>

                          )}

                        </button>


                        {/* SAGA */}

                        <button
                          type="button"
                          disabled={
                            sagaLoading[
                              paymentId
                            ] ||
                            sagaCompleted
                          }
                          onClick={() =>
                            executeSaga(
                              payment
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {sagaLoading[
                            paymentId
                          ] ? (

                            <>

                              <RefreshCw
                                size={15}
                                className="animate-spin"
                              />

                              Running Saga...

                            </>

                          ) : (

                            <>

                              <Play
                                size={15}
                              />

                              {sagaCompleted
                                ? 'Saga Completed'
                                : 'Run Recovery Saga'}

                            </>

                          )}

                        </button>


                        {/* RESUME */}

                        {sagaFailed && (

                          <button
                            type="button"
                            disabled={
                              resumeLoading[
                                paymentId
                              ]
                            }
                            onClick={() =>
                              resumeSaga(
                                payment
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            {resumeLoading[
                              paymentId
                            ] ? (

                              <>

                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />

                                Resuming...

                              </>

                            ) : (

                              <>

                                <RefreshCw
                                  size={15}
                                />

                                Resume Saga

                              </>

                            )}

                          </button>

                        )}

                      </div>

                    </div>

                    {saga && (

                      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">

                        <div className="flex items-start gap-3">


                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              sagaCompleted
                                ? 'bg-emerald-50 text-emerald-600'
                                : sagaFailed
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-amber-50 text-amber-600'
                            }`}
                          >

                            {sagaCompleted ? (

                              <CheckCircle2
                                size={18}
                              />

                            ) : sagaFailed ? (

                              <XCircle
                                size={18}
                              />

                            ) : (

                              <Clock3
                                size={18}
                              />

                            )}

                          </div>


                          <div className="min-w-0 flex-1">


                            <div className="flex flex-wrap items-center justify-between gap-2">

                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                                Recovery Saga

                              </p>


                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  sagaCompleted
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : sagaFailed
                                      ? 'bg-red-50 text-red-600'
                                      : 'bg-amber-50 text-amber-600'
                                }`}
                              >

                                {formatReason(
                                  sagaStatus
                                )}

                              </span>

                            </div>


                            {/* SAGA DETAILS */}

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">


                              <div className="rounded-lg bg-slate-50 p-3">

                                <p className="text-xs text-slate-400">

                                  Saga ID

                                </p>


                                <p className="mt-1 break-all text-xs font-semibold text-slate-700">

                                  {saga?.sagaId ||
                                    'N/A'}

                                </p>

                              </div>


                              <div className="rounded-lg bg-slate-50 p-3">

                                <p className="text-xs text-slate-400">

                                  Current Step

                                </p>


                                <p className="mt-1 text-sm font-semibold text-slate-700">

                                  {formatReason(
                                    getSagaStep(
                                      paymentId
                                    )
                                  )}

                                </p>

                              </div>


                              <div className="rounded-lg bg-slate-50 p-3">

                                <p className="text-xs text-slate-400">

                                  Action

                                </p>


                                <p className="mt-1 text-sm font-semibold text-slate-700">

                                  {formatAction(
                                    getSagaAction(
                                      paymentId
                                    )
                                  )}

                                </p>

                              </div>


                              <div className="rounded-lg bg-slate-50 p-3">

                                <p className="text-xs text-slate-400">

                                  Result

                                </p>


                                <p className="mt-1 text-sm font-semibold text-slate-700">

                                  {formatAction(
                                    getSagaResult(
                                      paymentId
                                    )
                                  )}

                                </p>

                              </div>

                            </div>


                            {/* MESSAGE */}

                            {saga?.message && (

                              <div className="mt-3 rounded-lg bg-slate-50 p-3">

                                <p className="text-xs text-slate-400">

                                  Saga Message

                                </p>


                                <p className="mt-1 text-sm text-slate-600">

                                  {saga.message}

                                </p>

                              </div>

                            )}


                            {/* ERROR MESSAGE */}

                            {saga?.errorMessage && (

                              <div className="mt-3 rounded-lg bg-red-50 p-3">

                                <p className="text-xs text-red-400">

                                  Error

                                </p>


                                <p className="mt-1 text-sm text-red-600">

                                  {saga.errorMessage}

                                </p>

                              </div>

                            )}


                            {/* EXECUTION RESULT */}

                            {saga?.executionResult && (

                              <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">

                                <div className="flex items-center gap-2">

                                  <Sparkles
                                    size={14}
                                    className="text-indigo-500"
                                  />


                                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">

                                    Recovery Execution

                                  </p>

                                </div>


                                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">


                                  <div>

                                    <p className="text-xs text-slate-400">

                                      Payment

                                    </p>


                                    <p className="mt-1 text-sm font-semibold text-slate-700">

                                      {saga.executionResult.paymentId ||
                                        payment?.paymentId ||
                                        `#${paymentId}`}

                                    </p>

                                  </div>


                                  <div>

                                    <p className="text-xs text-slate-400">

                                      Failure Reason

                                    </p>


                                    <p className="mt-1 text-sm font-semibold text-slate-700">

                                      {formatReason(
                                        saga.executionResult.failureReason
                                      )}

                                    </p>

                                  </div>


                                  <div>

                                    <p className="text-xs text-slate-400">

                                      AI Confidence

                                    </p>


                                    <p className="mt-1 text-sm font-semibold text-slate-700">

                                      {saga.executionResult.aiConfidence != null

                                        ? `${(

                                            Number(
                                              saga.executionResult.aiConfidence
                                            ) <= 1

                                              ? Number(
                                                  saga.executionResult.aiConfidence
                                                ) * 100

                                              : Number(
                                                  saga.executionResult.aiConfidence
                                                )

                                          ).toFixed(0)}%`

                                        : 'N/A'}

                                    </p>

                                  </div>


                                  <div>

                                    <p className="text-xs text-slate-400">

                                      Reminder

                                    </p>


                                    <p className="mt-1 text-sm font-semibold text-slate-700">

                                      {saga.executionResult.reminderSentAt
                                        ? 'Sent'
                                        : 'Not Sent'}

                                    </p>

                                  </div>


                                </div>


                                {saga.executionResult.aiRecommendation && (

                                  <div className="mt-3">

                                    <p className="text-xs text-slate-400">

                                      AI Recommendation

                                    </p>


                                    <p className="mt-1 text-sm leading-6 text-slate-700">

                                      {saga.executionResult.aiRecommendation}

                                    </p>

                                  </div>

                                )}

                              </div>

                            )}

                          </div>

                        </div>

                      </div>

                    )}

                    {existingInsight && (

                      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">

                        <div className="flex items-start gap-3">


                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">

                            <Sparkles
                              size={17}
                            />

                          </div>


                          <div className="min-w-0 flex-1">


                            <div className="flex flex-wrap items-center justify-between gap-2">

                              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">

                                AI Recommendation

                              </p>


                              {existingInsight.aiConfidence != null && (

                                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-indigo-600">

                                  Confidence:{' '}

                                  {getConfidence(
                                    existingInsight
                                  ).toFixed(0)}%

                                </span>

                              )}

                            </div>


                            <p className="mt-2 text-sm leading-6 text-slate-700">

                              {getRecommendation(
                                existingInsight
                              )}

                            </p>

                          </div>

                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-lg bg-white p-3">
                            <div className="flex items-center gap-1.5">
                              <Brain
                                size={14}
                                className="text-slate-400"
                              />
                              <span className="text-xs text-slate-400">
                                Recovery Action
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {formatAction(
                                existingInsight.action
                              )}

                            </p>

                          </div>


                          <div className="rounded-lg bg-white p-3">

                            <div className="flex items-center gap-1.5">

                              {String(
                                existingInsight.result ||
                                ''
                              ).toUpperCase() ===
                              'SUCCESS' ? (

                                <CheckCircle2
                                  size={14}
                                  className="text-emerald-500"
                                />

                              ) : (

                                <XCircle
                                  size={14}
                                  className="text-red-400"
                                />

                              )}


                              <span className="text-xs text-slate-400">

                                Result

                              </span>

                            </div>


                            <p className="mt-1 text-sm font-semibold text-slate-800">

                              {formatAction(
                                existingInsight.result
                              )}

                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                )

              }
            )}

          </div>

        )}

      </div>


      {insights.length > 0 && (

        <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">


          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

              <Brain
                size={19}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Saved AI Recovery Insights
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Persisted recovery decisions from the backend.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Saved Insights
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {insights.length}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs text-emerald-500">
                Successful
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {
                  insights.filter(
                    (item) =>
                      String(
                        item.result || ''
                      ).toUpperCase() ===
                      'SUCCESS'
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs text-amber-500">
                Pending / Other
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {
                  insights.filter(
                    (item) =>
                      String(
                        item.result || ''
                      ).toUpperCase() !==
                      'SUCCESS'
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AIRecovery