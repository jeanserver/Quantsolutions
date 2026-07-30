// A CSS/SVG phone frame with your actual dashboard-style content inside —
// no photo or hand, just a clean device mockup in brand colors.
function PhoneMockup({ className = '' }) {
  return (
    <div className={`relative mx-auto w-64 ${className}`}>
      <div className="rounded-[2.5rem] border-[10px] border-brand-black bg-brand-black shadow-cardHover">
        <div className="relative overflow-hidden rounded-[1.8rem] bg-brand-dark">
          <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-brand-black" />

          <div className="px-4 pb-6 pt-8">
            <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-brand-yellow">
              QuantSolutions
            </p>

            <div className="mt-5 rounded-xl bg-brand-charcoal p-3">
              <p className="text-[9px] uppercase tracking-wide text-gray-400">Portfolio Value</p>
              <p className="mt-1 text-xl font-bold text-white">$52,140</p>
              <div className="mt-3 h-14">
                <svg viewBox="0 0 200 50" className="h-full w-full">
                  <polyline
                    points="0,38 25,34 50,36 75,22 100,25 125,12 150,8 175,14 200,4"
                    fill="none"
                    stroke="#F2B705"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-brand-charcoal p-2.5">
                <p className="text-[8px] uppercase tracking-wide text-gray-400">Active Plans</p>
                <p className="mt-0.5 text-sm font-bold text-white">2</p>
              </div>
              <div className="rounded-lg bg-brand-charcoal p-2.5">
                <p className="text-[8px] uppercase tracking-wide text-gray-400">ROI</p>
                <p className="mt-0.5 text-sm font-bold text-brand-yellow">+6.2%</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-brand-charcoal px-3 py-2">
                <span className="text-[9px] text-gray-300">Basic Plan</span>
                <span className="text-[9px] font-semibold text-white">$8,200</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-brand-yellow px-3 py-2">
                <span className="text-[9px] text-brand-black">Standard Plan</span>
                <span className="text-[9px] font-semibold text-brand-black">$36,940</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneMockup;
