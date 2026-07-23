const values = [
  {
    title: 'Integrity',
    description: 'We act in our clients\u2019 best interests at every stage of the relationship.'
  },
  {
    title: 'Discipline',
    description: 'Consistent, process-driven decisions rather than reactive ones.'
  },
  {
    title: 'Transparency',
    description: 'Clear reporting, plain-language communication, and no hidden costs.'
  },
  {
    title: 'Stewardship',
    description: 'Treating client capital with the same care we would our own.'
  }
];

function AboutPage() {
  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
            About QuantSolutions
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Built on discipline, research, and long-term partnership.
          </h1>
          <p className="mt-6 max-w-2xl text-gray-300">
            QuantSolutions was founded to give individuals and institutions
            access to the same rigorous, research-led investment approach
            traditionally reserved for large institutional investors.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-brand-black">Our Story</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              QuantSolutions was established by a team of investment
              professionals with backgrounds in asset management, financial
              planning, and risk analysis. We saw a need for an advisory firm
              that prioritized long-term client outcomes over short-term
              product sales.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Today, our team works with clients ranging from individual
              investors planning for retirement to institutions seeking
              disciplined portfolio management, always guided by a
              fiduciary standard.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-black">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              To provide clear, honest, and effective investment management
              that helps clients meet real financial goals — from funding
              education, to retirement, to generational wealth transfer.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We measure our success by the outcomes we deliver for clients,
              not by assets gathered.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white border-t border-gray-100">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold text-brand-black">
            Our Values
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-gray-200 p-6 text-center shadow-card"
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow font-bold text-brand-black">
                  {value.title.charAt(0)}
                </div>
                <h3 className="font-semibold text-brand-black">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
