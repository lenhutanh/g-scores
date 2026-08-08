import { NavLink, Outlet } from 'react-router-dom'

export default function MainLayout() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-bold text-brand-blue bg-brand-yellow/15 border-b-2 md:border-b-0 md:border-r-4 border-brand-yellow px-3 py-2 md:px-4 md:py-2 rounded-t-md md:rounded-tr-none md:rounded-l-md transition-all whitespace-nowrap"
      : "font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-200/50 px-3 py-2 md:px-4 md:py-2 rounded-md transition-all whitespace-nowrap"

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <header className="bg-brand-blue text-white h-16 flex items-center justify-center shadow-sm shrink-0">
        <h1 className="text-2xl font-bold tracking-wider">G-Scores</h1>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        <aside className="w-full md:w-64 bg-slate-100/90 border-b md:border-b-0 md:border-r border-slate-200 p-3 md:p-4 select-none shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
            <NavLink to="/" end className={getLinkClass}>
              Search Scores
            </NavLink>
            <NavLink to="/leaderboard" className={getLinkClass}>
              Leaderboard
            </NavLink>
            <NavLink to="/reports" className={getLinkClass}>
              Reports
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8 bg-white min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
