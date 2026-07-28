import { Link } from 'react-router-dom';
import Reveal from '../components/common/Reveal.jsx';
import { useScrollProgress } from '../hooks/useInView.js';

const processSteps = [
  {
    number: '01',
    title: 'Choose a plan',
    description:
      'Select the tier that fits your capital and goals, from Basic through Institutional.'
  },
  {
    number: '02',
    title: 'Fund your account',
    description:
      'Deposit by bank transfer or crypto. Every deposit is reviewed and confirmed by our team before it is applied to your account.'
  },
  {
    number: '03',
    title: 'Capital is allocated',
    description:
      'Your funds are allocated according to your selected plan. Every allocation is reviewed before it takes effect.'
  },
  {
    number: '04',
    title: 'Performance is reported',
    description:
      'When a real, reportable result is achieved for your plan, it is recorded and reflected in your dashboard — with a full history you can review at any time.'
  }
];

const controls = [
  {
    title: 'Password Security',
    description:
      'Passwords are never stored in plain text. They are hashed using industry-standard one-way encryption before being saved.'
  },
  {
    title: 'Role-Based Access',
    description:
      'Client and administrative functions are strictly separated. Administrative actions require an authenticated admin account and cannot be accessed from a client login.'
  },
  {
    title: 'AI-Assisted Analysis',
    description:
      'AI tools help inform how we evaluate opportunities and risk. Every output is reviewed by our team, not applied automatically to any account.'
  },
  {
    title: 'Reviewed, Not Automated',
    description:
      'Deposits, withdrawals, and plan selections are reviewed by our team before they take effect. Nothing moves automatically without a human check.'
  },
  {
    title: 'Encrypted in Transit',
    description:
      'All communication between your browser and our servers is encrypted using HTTPS.'
  },
  {
    title: 'Rate-Limited Endpoints',
    description:
      'Our systems apply rate limiting and input validation to reduce the risk of abuse and automated attacks.'
  },
  {
    title: 'Auditable History',
    description:
      'Every plan performance update is logged with a timestamp, the period it applies to, and the reported return — nothing is edited without a trace.'
  }
];

const principles = [
  {
    title: 'Performance-Fee Only',
    description:
      'We charge a fee only on real profit generated for your account — never a fixed percentage of your total capital, and never a guaranteed return.'
  },
  {
    title: 'No Guaranteed Returns',
    description:
      'We do not promise fixed or guaranteed returns of any kind. Reported performance reflects real, actual results for your plan tier.'
  },
  {
    title: 'Full Transparency',
    description:
      'Your dashboard shows your invested amount, current value, and a complete history of every reported performance update — never a hidden calculation.'
  }
];

function ProcessSection() {
  const [sectionRef, progress] = useScrollProgress();

  return (
    <section className="section" ref={sectionRef}>
      <div className="container-page">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-brand-black">
            How Your Capital Is Managed
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-500">
            A straightforward process, reviewed by our team at every stage.
          </p>
        </Reveal>
        <div className="relative mt-16 grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div
            className="absolute left-0 right-0 top-6 hidden h-0.5 bg-gray-200 lg:block"
            aria-hidden="true"
          >
            <div
              className="h-full bg-brand-yellow transition-[width] duration-200 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          {processSteps.map((step, index) => (
            <Reveal key={step.number} delay={index * 120}>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-yellow bg-white text-sm font-bold text-brand-black">
                  {step.number}
                </div>
                <h3 className="mt-4 text-base font-semibold text-brand-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurApproachPage() {
  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
              Our Approach
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
              A disciplined process, reviewed by people, not left to a black box.
            </h1>
            <p className="mt-6 max-w-2xl text-gray-300">
              QuantSolutions uses AI-assisted analysis to help inform investment
              decisions. Every insight is reviewed by our team before it ever reaches
              a client account — nothing is fully automated, and nothing moves
              without human sign-off.
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSection />

      <section className="section bg-brand-offwhite">
        <div className="container-page">
          <Reveal>
            <h2 className="text-center text-3xl font-bold text-brand-black">
              Access & Security Controls
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-gray-500">
              Practical safeguards that protect your account and your data.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {controls.map((control, index) => (
              <Reveal key={control.title} delay={index * 100}>
                <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-card">
                  <div className="mb-4 h-1 w-10 rounded-full bg-brand-yellow" />
                  <h3 className="text-base font-semibold text-brand-black">
                    {control.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {control.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-brand-charcoal text-brand-white">
        <div className="container-page">
          <Reveal>
            <h2 className="text-center text-3xl font-bold">Our Transparency Principles</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 120}>
                <div className="rounded-xl border border-gray-700 bg-brand-dark p-6">
                  <h3 className="text-base font-semibold text-brand-yellow">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">{principle.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="container-page rounded-2xl bg-brand-yellow px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-brand-black">
              Questions about how we manage capital?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-brand-black/80">
              Our team is happy to walk you through our process in more detail.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-secondary">
                Talk to Our Team
              </Link>
              <Link to="/investment-solutions" className="btn btn-outline border-brand-black">
                View Investment Plans
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default OurApproachPage;
