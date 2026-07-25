import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-brand-yellow">Quant</span>
            <span>Solutions</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Professional investment management and advisory services built on
            disciplined research, transparency, and long-term client
            partnership.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-yellow">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-brand-white">About Us</Link></li>
            <li><Link to="/investment-solutions" className="hover:text-brand-white">Investment Solutions</Link></li>
            <li><Link to="/about/technology" className="hover:text-brand-white">Technology</Link></li>
            <li><Link to="/about/investor-relations" className="hover:text-brand-white">Investor Relations</Link></li>
            <li><Link to="/legal" className="hover:text-brand-white">Legal & Compliance</Link></li>
            <li><Link to="/faq" className="hover:text-brand-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-brand-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-yellow">
            Account
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li><Link to="/login" className="hover:text-brand-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-brand-white">Open an Account</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-white">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-yellow">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>Strickstrasse 65</li>
            <li>8002 Zürich, Switzerland</li>
            <li>support@quantsolutions.xyz</li>
            <li>+1 (508) 964-3322</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-charcoal py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {year} QuantSolutions. All rights reserved.</p>
          <p>Investing involves risk, including possible loss of principal.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
