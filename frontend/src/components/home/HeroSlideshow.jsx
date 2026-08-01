import { useEffect, useState } from 'react';

// A looping slideshow: fictional personas (name, location, avatar initial)
// asking real investor questions one at a time, then QuantSolutions
// answering them one at a time. Only one card is ever visible, so this is
// mobile-safe by construction -- no scattered absolute positioning to break
// on narrow screens.
const questions = [
  { name: 'Jordan M.', location: 'New York, USA', text: 'Where should I invest the money I just made?' },
  { name: 'Elena R.', location: 'Amsterdam, Netherlands', text: "I'm afraid of losing everything I've saved." },
  { name: 'Daniel K.', location: 'Singapore', text: "There are too many options. I don't know who to trust." }
];

const answers = [
  { text: 'Choose from 5 plans, from Basic to Institutional.' },
  { text: 'Every allocation is reviewed by our team before it is funded.' },
  { text: 'Real performance, honestly reported, always visible on your dashboard.' }
];

// Slight position variation per slide, expressed as safe percentage offsets
// that work identically on any screen width.
const slidePositions = [
  { top: '8%', left: '50%' },
  { top: '50%', left: '78%' },
  { top: '82%', left: '50%' }
];

const SLIDE_DURATION = 2800;

function AvatarInitial({ name }) {
  const initial = name.trim().charAt(0);
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-brand-black">
      {initial}
    </div>
  );
}

function HeroSlideshow() {
  const [stage, setStage] = useState('questions'); // 'questions' | 'answers'
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const list = stage === 'questions' ? questions : answers;
      if (index < list.length - 1) {
        setIndex(index + 1);
      } else if (stage === 'questions') {
        setStage('answers');
        setIndex(0);
      } else {
        setStage('questions');
        setIndex(0);
      }
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [stage, index]);

  const position = slidePositions[index % slidePositions.length];

  return (
    <div className="relative mx-auto h-[340px] w-full max-w-lg">
      {/* Central hub mark, always present behind the slideshow */}
      <div className="absolute left-1/2 top-1/2 z-0 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-yellow/90 shadow-cardHover">
        <span className="text-center text-[11px] font-extrabold leading-tight text-brand-black">
          Quant
          <br />
          Solutions
        </span>
      </div>

      {stage === 'questions' ? (
        <div
          key={`q-${index}`}
          className="absolute z-10 w-64 max-w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-heroSlideIn rounded-xl bg-brand-charcoal p-4 shadow-cardHover"
          style={{ top: position.top, left: position.left }}
        >
          <div className="flex items-center gap-2">
            <AvatarInitial name={questions[index].name} />
            <div>
              <p className="text-xs font-semibold text-white">{questions[index].name}</p>
              <p className="text-[10px] text-gray-400">{questions[index].location}</p>
            </div>
          </div>
          <p className="mt-2.5 text-sm text-gray-200">{questions[index].text}</p>
        </div>
      ) : (
        <div
          key={`a-${index}`}
          className="absolute z-10 w-64 max-w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-heroSlideIn rounded-xl bg-brand-yellow p-4 shadow-cardHover"
          style={{ top: position.top, left: position.left }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-black/70">
            QuantSolutions
          </p>
          <p className="mt-1.5 text-sm font-medium text-brand-black">{answers[index].text}</p>
        </div>
      )}

      <style>{`
        @keyframes heroSlideIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-heroSlideIn {
          animation: heroSlideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default HeroSlideshow;
