import { Link } from 'react-router-dom';
import Reveal from '../common/Reveal.jsx';

function DashboardPreviewSection() {
  return (
    <section className="section bg-brand-offwhite">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <h2 className="text-3xl font-bold text-brand-black">
              See Your Portfolio Come Together
            </h2>
            <p className="mt-4 max-w-md text-gray-500">
              Your dashboard shows exactly what's invested, what it's worth today, and every
              real, reported performance update — no black box, no simulated numbers.
            </p>
            <div className="mt-6">
              <Link to="/register" className="btn btn-primary">
                Open Your Dashboard
              </Link>
            </div>
          </Reveal>

          <Reveal direction="right" delay={150}>
            <div className="mx-auto max-w-md rounded-2xl bg-brand-black p-6 shadow-cardHover">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">
                    Active Plans
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">2</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">
                    Invested
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">$45,000</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">ROI</p>
                  <p className="mt-1 text-lg font-bold text-brand-yellow">+6.2%</p>
                </div>
              </div>
              <div className="mt-5 h-24 rounded-lg bg-brand-charcoal p-3">
                <svg viewBox="0 0 200 60" className="h-full w-full">
                  <polyline
                    points="0,45 30,40 60,42 90,28 120,30 150,15 180,10 200,4"
                    fill="none"
                    stroke="#F2B705"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-brand-charcoal px-3 py-1 text-[10px] font-medium text-gray-300">
                  Basic
                </span>
                <span className="rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-medium text-brand-black">
                  Standard
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreviewSection;
