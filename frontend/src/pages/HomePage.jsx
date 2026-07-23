import { Link } from 'react-router-dom';

const pillars = [
  {
    title: 'Research-Driven Approach',
    description:
      'Every recommendation is grounded in fundamental analysis, risk assessment, and long-term market research — not speculation.'
  },
  {
    title: 'Regulated & Transparent',
    description:
      'We operate with full transparency around fees, holdings, and reporting so clients always know exactly where they stand.'
  },
  {
    title: 'Dedicated Advisory Team',
    description:
      'Work directly with experienced advisors who tailor strategies to your goals, timeline, and risk tolerance.'
  },
  {
    title: 'Institutional-Grade Custody',
    description:
      'Client assets are held with reputable custodial partners under strict compliance and reporting standards.'
  }
];

const services = [
  {
    name: 'Wealth Management',
    description: 'Comprehensive, goals-based planning for individuals and families.'
  },
  {
    name: 'Portfolio Advisory',
    description: 'Diversified portfolio construction across equities and fixed income.'
  },
  {
    name: 'Retirement Planning',
    description: 'Long-horizon strategies designed around retirement income needs.'
  }
];

function HomePage() {
  return (
    <div>
      <section className="bg-brand-black text-brand-white">
        <div className="container-page section grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
              Professional Investment Management
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Disciplined strategies for building and preserving wealth.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300">
              QuantSolutions partners with individuals and institutions to
              design portfolios rooted in research, risk management, and
              long-term thinking — not trends.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn btn-primary">
                Open an Account
              </Link>
              <Link
                to="/investment-solutions"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-brand-black"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-brand-charcoal bg-brand-dark p-8">
            <h3 className="text-lg font-semibold text-brand-yellow">
              Our Investment Philosophy
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow" />
                Capital preservation is prioritized alongside growth.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow" />
                Diversification across asset classes and time horizons.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow" />
                Clear, regular reporting with no hidden fees.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow" />
                Advisors who act as fiduciaries to our clients.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="text-center text-3xl font-bold text-brand-black">
            Why Clients Choose QuantSolutions
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-card transition-shadow hover:shadow-cardHover"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-brand-yellow" />
                <h3 className="text-base font-semibold text-brand-black">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-brand-charcoal text-brand-white">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold">Our Core Services</h2>
              <p className="mt-2 max-w-xl text-gray-300">
                Tailored solutions for every stage of your financial journey.
              </p>
            </div>
            <Link
              to="/investment-solutions"
              className="btn btn-primary whitespace-nowrap"
            >
              View All Solutions
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-xl border border-gray-700 bg-brand-dark p-6"
              >
                <h3 className="text-base font-semibold text-brand-yellow">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page rounded-2xl bg-brand-yellow px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-brand-black">
            Ready to build a disciplined investment strategy?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-brand-black/80">
            Speak with our advisory team and start with a personalized
            portfolio review.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn btn-secondary">
              Get Started
            </Link>
            <Link to="/contact" className="btn btn-outline border-brand-black">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
