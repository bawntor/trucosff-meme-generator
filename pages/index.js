import MemeGenerator from '../components/MemeGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="container mx-auto px-4">
        <MemeGenerator />
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} TrucosFF - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
