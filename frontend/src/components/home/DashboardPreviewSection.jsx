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
            <div className="relative mx-auto max-w-md">
              <svg
                className="pointer-events-none absolute -left-16 -top-10 hidden h-[420px] w-[560px] lg:block"
                viewBox="0 0 560 420"
                aria-hidden="true"
              >
                <path
                  d="M 120 40 C 160 90, 170 110, 210 140"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                <circle cx="210" cy="140" r="4" fill="#0A0A0A" />
                <path
                  d="M 460 60 C 420 120, 400 150, 350 190"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />
                <circle cx="350" cy="190" r="4" fill="#0A0A0A" />
              </svg>

              <div className="absolute -left-6 -top-6 hidden max-w-[220px] rounded-lg bg-white p-3 shadow-card lg:block">
                <p className="text-xs font-semibold text-brand-black">5 Investment Tiers</p>
                <p className="mt-0.5 text-xs text-gray-500">Basic through Institutional</p>
              </div>

              <div className="absolute -right-4 top-6 hidden max-w-[220px] rounded-lg bg-brand-black p-3 text-brand-white shadow-card lg:block">
                <p className="text-xs font-semibold text-brand-yellow">Real Performance</p>
                <p className="mt-0.5 text-xs text-gray-300">Never simulated, always reported</p>
              </div>

              <div className="relative rounded-2xl bg-brand-black p-6 shadow-cardHover">
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreviewSection;
