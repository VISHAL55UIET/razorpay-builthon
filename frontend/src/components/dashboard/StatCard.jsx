import {
  CreditCard,
  CircleX,
  CircleCheck,
  IndianRupee,
  TrendingUp,
  Clock,
} from 'lucide-react'

const iconMap = {
  payments: CreditCard,
  failed: CircleX,
  successful: CircleCheck,
  revenue: IndianRupee,
  recovery: TrendingUp,
  pending: Clock,
}

function StatCard({
  title,
  value,
  change = 0,
  changeText = 'vs last period',
  type,
}) {

  const Icon = iconMap[type] || CreditCard

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">

          <Icon
            size={20}
            strokeWidth={1.8}
          />

        </div>

      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">

        <span
          className={`font-semibold ${
            Number(change) >= 0? 'text-emerald-600': 'text-red-500'
          }`}
        >
          {Number(change) >= 0 ? '+' : ''}
          {change}%
        </span>

        <span className="text-slate-400">
          {changeText}
        </span>

      </div>

    </div>
  )
}

export default StatCard