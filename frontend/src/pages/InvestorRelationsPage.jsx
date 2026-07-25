const glance = [
  { label: 'Product', value: 'AI-managed crypto and traditional asset portfolios' },
  { label: 'Problem', value: 'Retail investors lack access to professional, algorithm-driven portfolio management.' },
  { label: 'Solution', value: 'An automated, AI-driven investment platform with human oversight.' }
];

const thesis = [
  {
    title: 'One platform, two asset classes',
    description: 'Most competitors focus on either crypto or traditional assets. QuantSolutions manages both under a single AI-driven engine.'
  },
  {
    title: 'A scalable data advantage',
    description: 'Our models improve as we add users, assets, and market conditions — strengthening allocation and risk decisions over time.'
  },
  {
    title: 'Compliance-minded from day one',
    description: 'Built with regulatory frameworks, custody partners, and jurisdictional considerations in mind from the start.'
  }
];

function InvestorRelationsPage() {
  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
            Investor Relations
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold sm:text-5xl">
            Building the AI investment platform for crypto and traditional assets.
          </h1>
          <p className="mt-6 max-w-xl text-gray-300">
            Information for prospective and existing investors. This page
            does not constitute a public offer of securities.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-brand-black">QuantSolutions at a Glance</h2>
          <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {glance.map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand-yellow">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm text-gray-600">{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/contact" className="btn btn-primary">
              Request Investor Materials
            </a>
          </div>
        </div>
      </section>

      <section className="section bg-brand-charcoal text-brand-white">
        <div className="container-page">
          <h2 className="text-2xl font-bold">Investment Thesis</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {thesis.map((point) => (
              <div key={point.title} className="rounded-xl border border-gray-700 bg-brand-dark p-6">
                <h3 className="text-base font-semibold text-brand-yellow">{point.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
            This page may contain forward-looking statements subject to risks
            and uncertainties. Nothing here constitutes an offer to sell or a
            solicitation of an offer to buy any securities. Any investment
            opportunity is offered only to qualified investors through
            official documentation and in compliance with applicable laws.
          </p>
        </div>
      </section>
    </div>
  );
}

export default InvestorRelationsPage;
