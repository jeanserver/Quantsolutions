const solutions = [
  {
    name: 'Managed Portfolio Advisory',
    description:
      'A professionally managed, diversified portfolio built around your risk profile, time horizon, and financial goals. Includes ongoing rebalancing and quarterly reviews.',
    features: ['Custom risk assessment', 'Diversified asset allocation', 'Quarterly performance reviews']
  },
  {
    name: 'Retirement Planning',
    description:
      'Long-term planning designed to help you build sustainable income for retirement, incorporating tax-aware strategies and withdrawal planning.',
    features: ['Retirement income modeling', 'Tax-aware strategy design', 'Ongoing plan adjustments']
  },
  {
    name: 'Fixed Income Strategies',
    description:
      'Capital-preservation-focused strategies using government and investment-grade corporate fixed income instruments.',
    features: ['Government & corporate bonds', 'Laddering strategies', 'Interest rate risk management']
  },
  {
    name: 'Equity Growth Strategies',
    description:
      'Long-term equity strategies focused on fundamentally strong businesses, sector diversification, and disciplined entry points.',
    features: ['Fundamental analysis', 'Sector diversification', 'Long-term holding discipline']
  },
  {
    name: 'Institutional Advisory',
    description:
      'Dedicated advisory services for institutions, including endowments, trusts, and corporate treasury management.',
    features: ['Custom mandates', 'Compliance-first reporting', 'Dedicated relationship manager']
  },
  {
    name: 'Financial Planning',
    description:
      'Holistic planning covering budgeting, education funding, insurance review, and estate planning coordination.',
    features: ['Goal-based planning', 'Education funding strategies', 'Estate planning coordination']
  }
];

function InvestmentSolutionsPage() {
  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
            Investment Solutions
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Strategies designed around your goals, not the market cycle.
          </h1>
          <p className="mt-6 max-w-2xl text-gray-300">
            Every solution begins with understanding your objectives, risk
            tolerance, and time horizon before any capital is allocated.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <div
              key={solution.name}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-card"
            >
              <h3 className="text-lg font-semibold text-brand-black">
                {solution.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                {solution.description}
              </p>
              <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-brand-charcoal text-brand-white">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold">Not sure which solution fits you?</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            Our advisory team will help identify the right strategy based on
            your financial situation and goals.
          </p>
          <a href="/contact" className="btn btn-primary mt-6 inline-flex">
            Schedule a Consultation
          </a>
        </div>
      </section>
    </div>
  );
}

export default InvestmentSolutionsPage;
