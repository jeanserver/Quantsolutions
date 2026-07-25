const policies = [
  {
    title: 'Terms & Conditions',
    description: 'The agreement governing your use of the QuantSolutions platform and services.'
  },
  {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal and financial data.'
  },
  {
    title: 'Compliance & Regulatory Status',
    description: 'An overview of our licensing status and the frameworks we operate under.'
  },
  {
    title: 'Security & Fraud Protection',
    description: 'How we safeguard client accounts and respond to suspicious activity.'
  },
  {
    title: 'Disclaimers',
    description: 'Important risk disclosures related to investing in crypto and traditional assets.'
  },
  {
    title: 'Code of Conduct',
    description: 'The standards we hold our team and partners to.'
  }
];

function LegalPage() {
  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
            Legal & Compliance
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold sm:text-5xl">
            Built to operate transparently and within the law.
          </h1>
          <p className="mt-6 max-w-xl text-gray-300">
            QuantSolutions is an AI-powered platform for crypto and
            traditional asset management. Below is where our governing
            policies and disclosures will live as we finalize them with legal
            counsel.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => (
            <div
              key={policy.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-card"
            >
              <h3 className="text-base font-semibold text-brand-black">
                {policy.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {policy.description}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Coming soon
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-brand-charcoal text-brand-white">
        <div className="container-page">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-300">
            The information on this website is for informational purposes
            only and does not constitute financial, investment, or trading
            advice. Investing involves risk, including possible loss of
            principal. QuantSolutions is not a bank. Availability of services
            may vary by jurisdiction.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LegalPage;
