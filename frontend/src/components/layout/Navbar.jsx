import { useState } from 'react'
import {
  Bell,
  Search,
  ChevronDown,
} from 'lucide-react'

function Navbar() {

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  )
  const userName =user.name ||user.email ||'User'
  const userInitial =
    userName.trim().charAt(0).toUpperCase()
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUserMenuOpen(false)
    window.location.href = '/signin'
  }
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-6">
      <div className="flex items-center">

        <div className="relative hidden w-72 md:block">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search payments, customers..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />

        </div>

      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell
            size={19}
            strokeWidth={1.8}
          />

         <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />

        </button>
        <div className="mx-1 h-7 w-px bg-slate-200" />
        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setUserMenuOpen(!userMenuOpen)
            }
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
          >

            {/* Avatar */}

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">

              {userInitial}

            </div>


            {/* User Information */}

            <div className="hidden text-left sm:block">

              <p className="text-sm font-medium text-slate-800">

                {user.name || 'User'}

              </p>

              <p className="text-xs text-slate-400">

                {user.role || 'User'}

              </p>

            </div>


            {/* Arrow */}

            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform sm:block ${
                userMenuOpen
                  ? 'rotate-180'
                  : ''
              }`}
            />

          </button>
{userMenuOpen && (
  <div
    className="
      absolute
      right-0
      top-full
      z-[100]
      mt-3
      w-64
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      bg-white
      shadow-[0_12px_35px_rgba(15,23,42,0.18)]
      ring-1
      ring-black/5
    "
  >

    {/* User Header */}
    <div className="bg-white px-4 py-4">

      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-indigo-100
            text-base
            font-bold
            text-indigo-600
          "
        >
          {userInitial}
        </div>
        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-slate-900">
            {user.name || 'User'}
          </p>

          <p className="truncate text-xs text-slate-500">
            {user.email || ''}
          </p>

        </div>

      </div>

    </div>
    <div className="h-px bg-slate-100" />
    <div className="bg-white px-4 py-3">

      <p className="mb-1 text-xs font-medium text-slate-400">
        Role
      </p>

      <span
        className="
          inline-flex
          rounded-md
          bg-slate-100
          px-2
          py-1
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-600
        "
        >
        {user.role || 'USER'}
      </span>
    </div>
    <div className="h-px bg-slate-100" />
    <div className="bg-white p-2">
      <button
        type="button"
        onClick={handleLogout}
        className="
          flex
          w-full
          items-center
          rounded-xl
          px-3
          py-2.5
          text-left
          text-sm
          font-semibold
          text-red-600
          transition
          hover:bg-red-50
        "
      >
        Logout
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </header>
  )
}
export default Navbar