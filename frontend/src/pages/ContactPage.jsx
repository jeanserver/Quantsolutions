import { useState } from 'react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import { isRequired, isValidEmail } from '../utils/validators.js';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isRequired(form.name)) newErrors.name = 'Name is required.';
    if (!isValidEmail(form.email)) newErrors.email = 'A valid email is required.';
    if (!isRequired(form.subject)) newErrors.subject = 'Subject is required.';
    if (!isRequired(form.message)) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <section className="bg-brand-black text-brand-white section">
        <div className="container-page">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
            Contact Us
          </p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Speak with our advisory team.
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-brand-black">Get in Touch</h2>
            <p className="mt-3 text-gray-600">
              Fill out the form and a member of our team will respond within
              one business day.
            </p>

            <div className="mt-8 space-y-5 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-brand-black">Office Address</p>
                <p>123 Financial District, Suite 400, New York, NY 10004</p>
              </div>
              <div>
                <p className="font-semibold text-brand-black">Email</p>
                <p>support@quantsolutions.com</p>
              </div>
              <div>
                <p className="font-semibold text-brand-black">Phone</p>
                <p>+1 (800) 555-0199</p>
              </div>
              <div>
                <p className="font-semibold text-brand-black">Business Hours</p>
                <p>Monday – Friday, 9:00 AM – 6:00 PM (EST)</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card sm:p-8">
            {submitted && (
              <div className="mb-5">
                <Alert variant="success" onClose={() => setSubmitted(false)}>
                  Your message has been submitted. Our team will be in touch shortly.
                </Alert>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                error={errors.name}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                error={errors.email}
                required
              />
              <Input
                label="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                error={errors.subject}
                required
              />
              <div>
                <label htmlFor="message" className="label-field">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your financial goals..."
                  className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
              </div>
              <Button type="submit" fullWidth>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
