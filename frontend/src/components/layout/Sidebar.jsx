import {
  LayoutDashboard,
  CreditCard,
  Users,
  RefreshCcw,
  BarChart3,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      label: 'Payments',
      icon: CreditCard,
      path: '/payments',
    },
    {
      label: 'Customers',
      icon: Users,
      path: '/customers',
    },
    {
      label: 'Recovery',
      icon: RefreshCcw,
      path: '/recovery',
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
    },
    {
      label: 'AI Recovery',
      icon: Sparkles,
      path: '/ai-recovery',
    },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname.startsWith(path)
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-800 bg-[var(--bg-sidebar)] text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-800 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold shadow-sm">
            AI
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">
                Revenue Recovery
              </h2>

              <p className="truncate text-xs text-slate-400">
                AI Payment Platform
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>
        )}

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  handleNavigation(item.path)
                }
                title={collapsed ? item.label : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${
                  collapsed
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className="shrink-0"
                />

                {!collapsed && (
                  <span className="font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-slate-800 p-3">
        <button
          type="button"
          onClick={() =>
            handleNavigation('/settings')
          }
          title={collapsed ? 'Settings' : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
            isActive('/settings')
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          } ${
            collapsed
              ? 'justify-center'
              : 'justify-start'
          }`}
        >
          <Settings
            size={19}
            strokeWidth={1.8}
            className="shrink-0"
          />

          {!collapsed && (
            <span className="font-medium">
              Settings
            </span>
          )}
        </button>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() =>
            setCollapsed((previous) => !previous)
          }
          className="mt-2 flex w-full items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-slate-800 hover:text-white"
          aria-label={
            collapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          title={
            collapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar