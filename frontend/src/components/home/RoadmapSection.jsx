import { useEffect, useRef, useState } from 'react';
import Reveal from '../common/Reveal.jsx';
import { useScrollProgress } from '../../hooks/useInView.js';

const roadSteps = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your account in a couple of minutes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 9l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    number: '02',
    title: 'Choose Your Plan',
    description: 'Compare tiers and select the one that fits your goals.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    number: '03',
    title: 'Make a Deposit',
    description: 'Fund your account by bank transfer or crypto.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v8M9.5 10.2c0-1.2 1.1-2.2 2.5-2.2s2.5.8 2.5 1.9c0 2.5-5 1.2-5 3.6 0 1.1 1.1 1.9 2.5 1.9s2.5-1 2.5-2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    number: '04',
    title: 'Grow Your Portfolio',
    description: 'Our team manages your allocation and reports real results.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="6" y="13" width="3" height="6" rx="0.6" fill="currentColor" />
        <rect x="11" y="9" width="3" height="10" rx="0.6" fill="currentColor" />
        <rect x="16" y="5" width="3" height="14" rx="0.6" fill="currentColor" />
      </svg>
    )
  },
  {
    number: '05',
    title: 'Request a Withdrawal',
    description: 'Submit a request, reviewed and processed by our team.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v7M8.5 12l3.5 3.5L15.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

// Positions sit ON the road path itself (viewBox 0 0 360 400) — a shorter,
// more compact version than before. Same coordinate space is used on both
// mobile and desktop; only the container width changes via CSS.
const markerPositions = [
  { x: 290, y: 30 },
  { x: 110, y: 120 },
  { x: 280, y: 210 },
  { x: 100, y: 300 },
  { x: 270, y: 375 }
];

const roadPath =
  'M290,30 C 200,75 80,85 110,120 C 190,155 320,165 280,210 ' +
  'C 190,255 60,265 100,300 C 190,335 300,345 270,375';

const markerColors = ['#F2B705', '#D9A400', '#B88A00', '#8C6900', '#5C4500'];

function RoadmapSection() {
  const [sectionRef, progress] = useScrollProgress();
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Single source of truth for both the road draw-in AND when each marker
  // appears, so the two can never fall out of sync with each other.
  const drawProgress = Math.min(progress * 1.3, 1);

  return (
    <section className="section overflow-hidden" ref={sectionRef}>
      <div className="container-page">
        <Reveal>
          <h2 className="text-3xl font-bold text-brand-black">Your Path to Growth</h2>
          <p className="mt-2 max-w-xl text-gray-500">
            A simple, guided process from sign-up to your first withdrawal.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6">
          <div className="space-y-5">
            {roadSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 110}>
                <div
                  className="flex items-center gap-5 bg-brand-yellow py-4 pl-6 pr-8 text-brand-black"
                  style={{
                    clipPath: 'polygon(0 0, 94% 0, 100% 50%, 94% 100%, 0 100%)'
                  }}
                >
                  <span className="text-3xl font-extrabold leading-none">{step.number}</span>
                  <div>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="text-sm text-brand-black/80">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Visible on all screen sizes now, not just desktop */}
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <svg viewBox="0 0 360 400" className="w-full" style={{ aspectRatio: '360 / 400' }}>
              <path
                d={roadPath}
                fill="none"
                stroke="#0A0A0A"
                strokeWidth="26"
                strokeLinecap="round"
                ref={pathRef}
                style={{
                  strokeDasharray: pathLength || 1000,
                  strokeDashoffset: pathLength - pathLength * drawProgress
                }}
              />
              {pathLength > 0 && (
                <path
                  d={roadPath}
                  fill="none"
                  stroke="#FAFAF8"
                  strokeWidth="2.5"
                  strokeDasharray="10 12"
                  style={{
                    strokeDashoffset: pathLength - pathLength * drawProgress,
                    opacity: drawProgress > 0.02 ? 1 : 0
                  }}
                />
              )}
              {markerPositions.map((position, index) => {
                const threshold = (index + 0.3) / markerPositions.length;
                const isVisible = drawProgress >= threshold;
                return (
                  <g
                    key={roadSteps[index].number}
                    style={{
                      transformOrigin: `${position.x}px ${position.y}px`,
                      transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'scale(1)' : 'scale(0.3)'
                    }}
                  >
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="26"
                      fill={markerColors[index]}
                      stroke="#0A0A0A"
                      strokeWidth="3"
                    />
                    <foreignObject x={position.x - 13} y={position.y - 13} width="26" height="26">
                      <div className="flex h-full w-full items-center justify-center text-brand-black">
                        {roadSteps[index].icon}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoadmapSection;
