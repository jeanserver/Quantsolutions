import Navbar from './components/layout/Navbar.jsx';
import AmbientBackground from './components/common/AmbientBackground.jsx';
import Footer from './components/layout/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <div className="relative flex min-h-screen flex-col bg-brand-offwhite">
      <AmbientBackground />
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
