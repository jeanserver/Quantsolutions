import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// A timed, sequential hero narrative: uncertainty -> our real process ->
// clarity. No new dependencies (no Framer Motion) -- pure CSS transitions
// driven by a setTimeout sequence, matching the rest of the site's
// zero-dependency animation approach.
const questions = [
  'Where should I invest $25,000?',
  'How much risk should I take?',
  'Can I trust anyone with my money?'
];

const responses = [
  'Choose from 5 plans, Basic to Institutional.',
  'Every plan selection is reviewed by our team before funds are allocated.',
  'Performance is real and reported, never simulated or guaranteed.',
  'You see everything from your dashboard, at any time.'
];

// Cumulative start times (ms) for each stage of the sequence.
const QUESTION_START = 200;
const QUESTION_GAP = 900;
const RESPONSE_START = QUESTION_START + questions.length * QUESTION_GAP + 500;
const RESPONSE_GAP = 850;
const END_STATE_START = RESPONSE_START + responses.length * RESPONSE_GAP + 600;

function HeroStoryboard() {
  const [visibleQuestions, setVisibleQuestions] = useState(0);
  const [visibleResponses, setVisibleResponses] = useState(0);
  const [showEndState, setShowEndState] = useState(false);

  useEffect(() => {
    const timers = [];

    questions.forEach((_, index) => {
      timers.push(
        setTimeout(() => setVisibleQuestions(index + 1), QUESTION_START + index * QUESTION_GAP)
      );
    });

    responses.forEach((_, index) => {
      timers.push(
        setTimeout(() => setVisibleResponses(index + 1), RESPONSE_START + index * RESPONSE_GAP)
      );
    });

    timers.push(setTimeout(() => setShowEndState(true), END_STATE_START));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-brand-charcoal bg-brand-dark p-6 shadow-cardHover">
        {/* Stage 1: uncertainty */}
        <div className="space-y-2.5">
          {questions.map((q, index) => (
            <div
              key={q}
              className={`rounded-lg bg-brand-charcoal px-4 py-2.5 text-sm text-gray-300 transition-all duration-500 ease-out ${
                index < visibleQuestions
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0'
              }`}
            >
              {q}
            </div>
          ))}
        </div>

        {/* Stage 2: our real process, responding to the uncertainty above */}
        {visibleQuestions >= questions.length && (
          <div className="mt-4 space-y-2.5 border-t border-brand-charcoal pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-yellow">
              QuantSolutions
            </p>
            {responses.map((r, index) => (
              <div
                key={r}
                className={`rounded-lg bg-brand-charcoal px-4 py-2.5 text-sm text-gray-200 transition-all duration-500 ease-out ${
                  index < visibleResponses
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-2 opacity-0'
                }`}
              >
                {r}
              </div>
            ))}
          </div>
        )}

        {/* Stage 3: end state, order emerging from the uncertainty above */}
        <div
          className={`mt-4 grid grid-cols-2 gap-3 border-t border-brand-charcoal pt-4 transition-all duration-700 ease-out ${
            showEndState ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          <div className="rounded-lg bg-brand-charcoal p-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">Plan Status</p>
            <p className="mt-1 text-sm font-bold text-white">Selected</p>
          </div>
          <div className="rounded-lg bg-brand-charcoal p-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">Review</p>
            <p className="mt-1 text-sm font-bold text-white">Team-Verified</p>
          </div>
          <div className="rounded-lg bg-brand-charcoal p-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">Reporting</p>
            <p className="mt-1 text-sm font-bold text-brand-yellow">Real, Not Simulated</p>
          </div>
          <div className="rounded-lg bg-brand-charcoal p-3">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">Dashboard</p>
            <p className="mt-1 text-sm font-bold text-white">Always Visible</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroStoryboard;
