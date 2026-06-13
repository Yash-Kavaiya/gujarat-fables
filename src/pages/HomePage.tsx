import { Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import PlaceCard from '../components/ui/PlaceCard';
import RegionFilter from '../components/ui/RegionFilter';
import HeroScene from '../components/HeroScene';
import CanvasBoundary from '../components/CanvasBoundary';
import { places, type Region } from '../data/places';
import { isWebGLAvailable } from '../lib/webgl';

const heroFallback = (
  <div
    className="absolute inset-0"
    style={{
      background:
        'radial-gradient(ellipse at 60% 30%, #f4cb86, #e07b45 55%, #1a1208 100%)',
    }}
  />
);

export default function HomePage() {
  const [region, setRegion] = useState<Region | 'All'>('All');
  const webgl = useMemo(() => isWebGLAvailable(), []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: places.length };
    for (const p of places) c[p.region] = (c[p.region] ?? 0) + 1;
    return c;
  }, []);

  const visible = useMemo(
    () => (region === 'All' ? places : places.filter((p) => p.region === region)),
    [region],
  );

  return (
    <main className="min-h-screen">
      <Navbar variant="home" />

      {/* ---------- Hero ---------- */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        {webgl ? (
          <CanvasBoundary fallback={heroFallback}>
            <Suspense fallback={heroFallback}>
              <HeroScene />
            </Suspense>
          </CanvasBoundary>
        ) : (
          heroFallback
        )}

        {/* readability scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night-900/30 via-transparent to-night-900" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="animate-fade-in text-sm uppercase tracking-[0.35em] text-gold/90">
            A 3D Journey Through Gujarat
          </p>
          <h1
            className="mt-4 max-w-4xl animate-fade-in font-display text-5xl leading-[1.05] text-sand-50 drop-shadow-lg sm:text-7xl"
            style={{ animationDelay: '120ms' }}
          >
            Where every place is a{' '}
            <span className="italic text-gold">living legend</span>
          </h1>
          <p
            className="mt-5 max-w-xl animate-fade-in text-base text-sand-100/85 sm:text-lg"
            style={{ animationDelay: '240ms' }}
          >
            Walk through the white desert of Kutch, descend the queen's inverted
            temple, and light the sanctum at Modhera — nine icons of Gujarat,
            told as fables and built in 3D.
          </p>
          <a
            href="#gallery"
            className="mt-9 animate-fade-in rounded-full bg-gold px-7 py-3 text-sm font-semibold text-night-900 shadow-lg shadow-gold/30 transition hover:scale-105"
            style={{ animationDelay: '360ms' }}
          >
            Explore the places ↓
          </a>
        </div>
      </section>

      {/* ---------- Gallery ---------- */}
      <section id="gallery" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl text-sand-50 sm:text-5xl">
            The Curated Nine
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sand-200/70">
            Each place was chosen for its story and its silhouette — myth and
            history rendered as something you can move through.
          </p>
        </div>

        <div className="mb-10">
          <RegionFilter active={region} onChange={setRegion} counts={counts} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <PlaceCard place={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-sand-500/10 bg-night-900 px-6 py-10 text-center text-sm text-sand-300/60">
        <p className="font-display text-lg text-sand-200">Gujarat Fable</p>
        <p className="mt-2">
          A stylized, respectful tribute to Gujarat's heritage ·{' '}
          <Link to="/about" className="text-gold hover:underline">
            About this project
          </Link>
        </p>
      </footer>
    </main>
  );
}
