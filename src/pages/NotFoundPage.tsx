import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-display text-7xl text-gold">404</p>
        <h1 className="mt-3 font-display text-3xl text-sand-50">
          This path leads nowhere
        </h1>
        <p className="mt-2 text-sand-200/70">
          The place you're looking for isn't on our map — yet.
        </p>
        <Link
          to="/"
          className="mt-7 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night-900 transition hover:scale-105"
        >
          Back to the gallery
        </Link>
      </div>
    </main>
  );
}
