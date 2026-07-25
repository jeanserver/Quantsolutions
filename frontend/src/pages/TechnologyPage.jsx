const principles = [
  { title: 'Safety First', description: 'Security and compliance considerations come before new features.' },
  { title: 'Simplicity', description: 'We hide complexity from users and explain decisions in plain language.' },
  { title: 'Modular by Design', description: 'Every part of the system can be improved independently, without downtime.' },
  { title: 'Data-Driven', description: 'Models and risk controls are guided by data, not speculation.' }
];

const steps = [
  'You answer a short risk-profile questionnaire.',
  'Our AI builds a diversified portfolio across crypto and traditional assets.',
  'The system monitors markets continuously.',
  'Your portfolio is automatically rebalanced as conditions change.'
];

const donts = [
  'We don\u2019t promise guaranteed returns.',
  'We don\u2019t commingle client funds.',
  'We don\u2019t expose private keys or operational secrets.',
  'We don\u2019t onboard sanctioned persons or users in restricted jurisdictions.'
];

function TechnologyPage() {
  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
            Technology
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold sm:text-5xl">
            The AI engine behind your portfolio.
          </h1>
          <p className="mt-6 max-w-xl text-gray-300">
            QuantSolutions combines machine learning, secure infrastructure,
            and institutional-grade partnerships to manage portfolios that
            are simple for you and rigorous behind the scenes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-brand-black">Engineering Principles</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <div key={p.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
                <h3 className="text-base font-semibold text-brand-black">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-brand-charcoal text-brand-white">
        <div className="container-page">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step} className="rounded-xl border border-gray-700 bg-brand-dark p-6">
                <span className="text-2xl font-bold text-brand-yellow">{i + 1}</span>
                <p className="mt-3 text-sm text-gray-300">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-brand-black">What We Don't Do</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {donts.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default TechnologyPage;
