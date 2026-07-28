import { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';

// Animates from 0 to `value` once the element scrolls into view.
// `suffix`/`prefix` let you write things like "5" -> "5 Tiers", "100%", etc.
function CountUp({ value, duration = 1200, prefix = '', suffix = '', decimals = 0 }) {
  const [ref, isInView] = useInView();
  const [display, setDisplay] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isInView) return undefined;

    let frame;
    function tick(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default CountUp;
