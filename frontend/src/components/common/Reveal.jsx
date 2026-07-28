import { useInView } from '../../hooks/useInView.js';

const directionClasses = {
  up: 'translate-y-6',
  left: 'translate-x-6',
  right: '-translate-x-6',
  none: ''
};

// Wraps children and fades/slides them in the first time they scroll into
// view. Pass `delay` (ms) to stagger multiple items in a group.
function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isInView
          ? 'translate-x-0 translate-y-0 opacity-100'
          : `opacity-0 ${directionClasses[direction]}`
      }`}
      style={{ transitionDelay: isInView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

export default Reveal;
