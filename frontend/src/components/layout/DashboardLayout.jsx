import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/dashboard/deposit', label: 'Deposit Request' },
  { to: '/dashboard/withdrawal', label: 'Withdrawal Request' },
  { to: '/dashboard/profile', label: 'Profile' }
];

function DashboardLayout({ children }) {
  return (
    <div className="container-page section">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-card lg:h-fit">
          <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-black text-brand-white'
                      : 'text-brand-black hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
