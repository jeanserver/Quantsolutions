import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="section flex items-center justify-center">
      <div className="container-page text-center">
        <p className="text-8xl font-extrabold text-brand-yellow">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-black">
          Page Not Found
        </h1>
        <p className="mt-2 text-gray-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary mt-6 inline-flex">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
