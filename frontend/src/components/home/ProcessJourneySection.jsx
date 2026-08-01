import { useEffect, useRef, useState } from 'react';
import Reveal from '../common/Reveal.jsx';
import { useScrollProgress } from '../../hooks/useInView.js';

// Six real milestones in the actual client flow, condensed from the three
// stages (fund -> select/review -> manage/report) into one continuous path.
// Highlighted (pill) stops mark the major checkpoints; plain-label stops
// mark the steps in between -- same visual language as the reference.
const stops = [
  { key: 'submitted', label: 'Deposit Submitted', highlight: true, icon: 'deposit' },
  { key: 'reviewed', label: 'Reviewed by Our Team', highlight: false },
  { key: 'selected', label: 'Plan Selected', highlight: true, icon: 'plan' },
  { key: 'approved', label: 'Allocation Approved', highlight: false },
  { key: 'reported', label: 'Performance Reported', highlight: false },
  { key: 'processed', label: 'Withdrawal Processed', highlight: true, icon: 'flag' }
];

// Points along a smooth winding path (viewBox 0 0 1000 480), alternating
// above/below a central baseline the way the reference does.
const points = [
  { x: 60, y: 90 },
  { x: 260, y: 210 },
  { x: 430, y: 90 },
  { x: 610, y: 300 },
  { x: 780, y: 130 },
  { x: 940, y: 300 }
];

const linePath =
  `M${points[0].x},${points[0].y} ` +
  `C ${points[0].x + 100},${points[0].y} ${points[1].x - 100},${points[1].y} ${points[1].x},${points[1].y} ` +
  `C ${points[1].x + 90},${points[1].y} ${points[2].x - 90},${points[2].y} ${points[2].x},${points[2].y} ` +
  `C ${points[2].x + 100},${points[2].y} ${points[3].x - 100},${points[3].y} ${points[3].x},${points[3].y} ` +
  `C ${points[3].x + 90},${points[3].y} ${points[4].x - 90},${points[4].y} ${points[4].x},${points[4].y} ` +
  `C ${points[4].x + 90},${points[4].y} ${points[5].x - 90},${points[5].y} ${points[5].x},${points[5].y}`;

function StopIcon({ type }) {
  if (type === 'deposit') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="8.2" stroke="#0A0A0A" strokeWidth="1.8" />
        <path d="M12 8v8M9.5 10.2c0-1.2 1.1-2.2 2.5-2.2s2.5.8 2.5 1.9c0 2.5-5 1.2-5 3.6 0 1.1 1.1 1.9 2.5 1.9s2.5-1 2.5-2.2" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'plan') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="#0A0A0A" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 3v18" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 4h11l-3 4 3 4H5" fill="#0A0A0A" />
    </svg>
  );
}

function ProcessJourneySection() {
  const [sectionRef, progress] = useScrollProgress();
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);

  const drawProgress = Math.min(progress * 1.3, 1);

  return (
    <section className="section overflow-hidden bg-brand-black" ref={sectionRef}>
      <div className="container-page">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-white">
            How QuantSolutions Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-400">
            Every stage of your journey, reviewed by our team, never left to a black box.
          </p>
        </Reveal>

        {/* Mobile: simple stacked list, no SVG (avoids squishing a wide graphic) */}
        <div className="mt-10 space-y-3 sm:hidden">
          {stops.map((stop) => (
            <div
              key={stop.key}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                stop.highlight ? 'bg-brand-yellow' : 'bg-brand-charcoal'
              }`}
            >
              {stop.highlight ? (
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-black/10">
                  <StopIcon type={stop.icon} />
                </span>
              ) : (
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-brand-yellow" />
              )}
              <span
                className={`text-sm font-medium ${
                  stop.highlight ? 'text-brand-black' : 'text-gray-200'
                }`}
              >
                {stop.label}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop/tablet: the winding line graphic */}
        <div className="mt-14 hidden sm:block">
          <svg viewBox="0 0 1000 480" className="w-full">
            <path
              d={linePath}
              fill="none"
              stroke="#3A3A3A"
              strokeWidth="2"
              opacity="0.5"
            />
            <path
              ref={pathRef}
              d={linePath}
              fill="none"
              stroke="#F2B705"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                strokeDasharray: pathLength || 1500,
                strokeDashoffset: pathLength - pathLength * drawProgress
              }}
            />

            {points.map((point, index) => {
              const threshold = (index + 0.15) / points.length;
              const isVisible = drawProgress >= threshold;
              const stop = stops[index];
              const labelAbove = point.y > 200;

              return (
                <g
                  key={stop.key}
                  style={{
                    transformOrigin: `${point.x}px ${point.y}px`,
                    transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'scale(1)' : 'scale(0.5)'
                  }}
                >
                  <circle cx={point.x} cy={point.y} r="6" fill="#F2B705" />

                  {stop.highlight ? (
                    <foreignObject
                      x={point.x - 90}
                      y={labelAbove ? point.y - 50 : point.y + 18}
                      width="180"
                      height="34"
                    >
                      <div className="flex items-center gap-2 rounded-full bg-brand-yellow px-3 py-1.5 shadow-card">
                        <StopIcon type={stop.icon} />
                        <span className="text-xs font-semibold text-brand-black">
                          {stop.label}
                        </span>
                      </div>
                    </foreignObject>
                  ) : (
                    <foreignObject
                      x={point.x - 80}
                      y={labelAbove ? point.y - 40 : point.y + 16}
                      width="160"
                      height="28"
                    >
                      <p className="text-center text-xs font-medium text-gray-300">
                        {stop.label}
                      </p>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}

export default ProcessJourneySection;
