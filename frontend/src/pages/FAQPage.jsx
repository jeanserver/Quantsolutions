import { useState } from 'react';

const faqs = [
  {
    question: 'How do I open an account with QuantSolutions?',
    answer:
      'You can open an account by registering online, completing our onboarding questionnaire, and verifying your identity. Once approved, you can fund your account and begin working with an advisor.'
  },
  {
    question: 'What are the minimum investment requirements?',
    answer:
      'Minimums vary by strategy and are discussed during your onboarding consultation, based on the type of account and services you select.'
  },
  {
    question: 'How are deposits and withdrawals processed?',
    answer:
      'Deposit and withdrawal requests are submitted through your dashboard and reviewed by our operations team. You will receive confirmation once a request has been processed.'
  },
  {
    question: 'Is my information kept secure?',
    answer:
      'Yes. We use industry-standard encryption, secure authentication, and strict internal access controls to protect your personal and account information.'
  },
  {
    question: 'Can I speak with an advisor directly?',
    answer:
      'Yes. Every client is paired with a dedicated advisor who can be reached through your dashboard or by contacting our support team directly.'
  },
  {
    question: 'How is performance reported?',
    answer:
      'Clients receive regular account statements and reporting summarizing account activity, contributions, and withdrawals in clear, plain-language format.'
  }
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-base font-semibold text-brand-black">
          {faq.question}
        </span>
        <span className="ml-4 text-xl text-brand-yellow">
          {isOpen ? '\u2212' : '+'}
        </span>
      </button>
      {isOpen && (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
      )}
    </div>
  );
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
            Support
          </p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default FAQPage;
