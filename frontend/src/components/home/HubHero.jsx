import { useEffect, useState } from 'react';

// A central-hub, radiating-spoke layout in the spirit of the Mosey
// reference, using real QuantSolutions content instead of illustrated
// artwork (which requires licensed illustration assets I don't have access
// to). Cards fade in sequentially around the hub.
const nodes = [
  { angle: -55, distance: 150, label: '5 Investment Tiers', sub: 'Basic to Institutional' },
  { angle: -15, distance: 190, label: 'Bank & Crypto Deposits', sub: 'Reviewed before funding' },
  { angle: 35, distance: 160, label: 'Real Performance', sub: 'Never simulated' },
  { angle: 130, distance: 175, label: 'Admin-Reviewed', sub: 'Every request checked' },
  { angle: 200, distance: 155, label: 'Transparent Reporting', sub: 'Full history, always visible' }
];

function polarToXY(angleDeg, distance) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * distance, y: Math.sin(rad) * distance };
}

function HubHero() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers = nodes.map((_, index) =>
      setTimeout(() => setVisibleCount(index + 1), 300 + index * 350)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-lg items-center justify-center">
      {/* Dashed connector lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {nodes.map((node, index) => {
          const { x, y } = polarToXY(node.angle, node.distance);
          const isVisible = index < visibleCount;
          return (
            <line
              key={node.label}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${x}px)`}
              y2={`calc(50% + ${y}px)`}
              stroke="#F2B705"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              style={{
                opacity: isVisible ? 0.6 : 0,
                transition: 'opacity 0.5s ease-out'
              }}
            />
          );
        })}
      </svg>

      {/* Central hub */}
      <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full bg-brand-yellow shadow-cardHover">
        <span className="text-center text-xs font-extrabold leading-tight text-brand-black">
          Quant
          <br />
          Solutions
        </span>
      </div>

      {/* Radiating cards */}
      {nodes.map((node, index) => {
        const { x, y } = polarToXY(node.angle, node.distance);
        const isVisible = index < visibleCount;
        return (
          <div
            key={node.label}
            className="absolute z-10 w-40 rounded-lg bg-brand-charcoal px-3 py-2 shadow-card transition-all duration-500 ease-out"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: isVisible
                ? 'translate(-50%, -50%) scale(1)'
                : 'translate(-50%, -50%) scale(0.6)',
              opacity: isVisible ? 1 : 0
            }}
          >
            <p className="text-xs font-semibold text-white">{node.label}</p>
            <p className="mt-0.5 text-[10px] text-gray-400">{node.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

export default HubHero;
