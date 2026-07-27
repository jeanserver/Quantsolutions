import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getPortfolioOverviewRequest } from '../../api/portfolioApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const DONUT_COLORS = ['#F2B705', '#CC9900', '#FAFAF8', '#8A8A8A', '#4D4D4D'];

function StatBlock({ label, value, accent, divider }) {
  return (
    <div className={divider ? 'border-l border-white/10 pl-6' : ''}>
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold sm:text-3xl ${accent || 'text-white'}`}>{value}</p>
    </div>
  );
}

function PortfolioOverviewWidget() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await getPortfolioOverviewRequest();
        if (isMounted) setOverview(data.overview);
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message || 'Unable to load portfolio overview right now.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-brand-black p-8 text-center text-sm text-gray-400 shadow-card">
        Loading portfolio overview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-brand-black p-8 text-center text-sm text-red-400 shadow-card">
        {error}
      </div>
    );
  }

  const hasData = overview && overview.activePlans > 0;

  return (
    <div className="rounded-2xl bg-brand-black p-6 shadow-card sm:p-8">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StatBlock label="Active Plans" value={hasData ? overview.activePlans : '—'} />
        <StatBlock
          label="Your Investment"
          value={hasData ? formatCurrency(overview.totalInvested) : '—'}
          divider
        />
        <StatBlock
          label="Current Value"
          value={hasData ? formatCurrency(overview.currentValue) : '—'}
          accent="text-brand-yellow"
          divider
        />
        <StatBlock
          label="ROI"
          value={hasData ? `${overview.roiPercent >= 0 ? '+' : ''}${overview.roiPercent}%` : '—'}
          accent={overview.roiPercent >= 0 ? 'text-brand-yellow' : 'text-red-400'}
          divider
        />
      </div>

      {!hasData ? (
        <p className="mt-10 py-8 text-center text-sm text-gray-400">
          You don't have an active investment plan yet. Choose a plan to start seeing your
          portfolio growth and allocation here.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-lg font-semibold text-white">Investment Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.growthSeries}>
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F2B705" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#F2B705" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff14" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                    tickFormatter={(v) => formatCurrency(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#232323',
                      border: '1px solid #ffffff1a',
                      borderRadius: 8,
                      color: '#fff'
                    }}
                    formatter={(value) => [formatCurrency(value), 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#F2B705"
                    strokeWidth={2}
                    fill="url(#growthFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-white">Your Portfolio</h3>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overview.allocation}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                      stroke="#0A0A0A"
                      strokeWidth={3}
                    >
                      {overview.allocation.map((entry, index) => (
                        <Cell key={entry.label} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#232323',
                        border: '1px solid #ffffff1a',
                        borderRadius: 8,
                        color: '#fff'
                      }}
                      formatter={(value) => [formatCurrency(value), 'Value']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-3">
                {overview.allocation.map((entry, index) => (
                  <li key={entry.label} className="flex items-center gap-2 text-sm text-gray-300">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
                    />
                    {entry.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioOverviewWidget;
