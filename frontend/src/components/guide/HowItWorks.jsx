import { Link } from "react-router-dom";

function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="flex h-20 items-center justify-between border-b border-white/10 px-6 md:px-12">

        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold">
            AI
          </div>

          <div>
            <p className="text-sm font-semibold">
              REVENUE RECOVERY
            </p>

            <p className="text-xs text-white/40">
              AI Payment Platform
            </p>
          </div>
        </Link>

        <Link
          to="/signin"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90"
        >
          Sign in
        </Link>

      </header>
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
          How it works
        </p>

        <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
          Recover revenue.
          <br />
          <span className="text-indigo-500">
            Step by step.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
          AI Revenue Recovery detects revenue at risk, understands
          the problem, chooses the right intervention and helps
          recover the lost payment.
        </p>

      </section>


      {/* Steps */}
      <section className="mx-auto max-w-6xl px-6 pb-24">

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <span className="text-sm font-semibold text-indigo-400">
              01
            </span>

            <h2 className="mt-4 text-2xl font-semibold">
              Detect
            </h2>

            <p className="mt-3 leading-7 text-white/45">
              Identify failed payments, checkout abandonment,
              subscription failures and other revenue at risk.
            </p>

          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <span className="text-sm font-semibold text-indigo-400">
              02
            </span>

            <h2 className="mt-4 text-2xl font-semibold">
              Diagnose
            </h2>

            <p className="mt-3 leading-7 text-white/45">
              Analyze payment and customer context to understand
              why the revenue is at risk.
            </p>

          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <span className="text-sm font-semibold text-indigo-400">
              03
            </span>

            <h2 className="mt-4 text-2xl font-semibold">
              Decide
            </h2>

            <p className="mt-3 leading-7 text-white/45">
              Select the most appropriate recovery intervention
              based on the situation and configured rules.
            </p>

          </div>


          {/* Step 4 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <span className="text-sm font-semibold text-indigo-400">
              04
            </span>

            <h2 className="mt-4 text-2xl font-semibold">
              Act
            </h2>

            <p className="mt-3 leading-7 text-white/45">
              Execute the recovery action and communicate with
              the customer through the appropriate channel.
            </p>

          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <span className="text-sm font-semibold text-indigo-400">
              05
            </span>

            <h2 className="mt-4 text-2xl font-semibold">
              Measure
            </h2>

            <p className="mt-3 leading-7 text-white/45">
              Track recovered revenue, recovery rate and the
              outcome of every recovery attempt.
            </p>

          </div>


          {/* Step 6 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <span className="text-sm font-semibold text-indigo-400">
              06
            </span>

            <h2 className="mt-4 text-2xl font-semibold">
              Audit
            </h2>

            <p className="mt-3 leading-7 text-white/45">
              Keep a clear record of what happened, why the
              decision was made and what action was taken.
            </p>

          </div>

        </div>
        <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-10 text-center">

          <h2 className="text-3xl font-semibold">
            Ready to recover revenue?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-white/50">
            Sign in and explore the complete revenue recovery
            dashboard.
          </p>

          <Link
            to="/signin"
            className="mt-7 inline-flex rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold transition hover:bg-indigo-500"
          >
            Explore the platform →
          </Link>
        </div>
      </section>
    </div>
  );
}
export default HowItWorks;