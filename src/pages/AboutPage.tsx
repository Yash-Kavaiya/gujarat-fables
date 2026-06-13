import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { places } from '../data/places';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar variant="place" />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <h1 className="font-display text-5xl text-sand-50">About Gujarat Fable</h1>
        <p className="mt-4 text-lg leading-relaxed text-sand-200/85">
          Gujarat Fable is an interactive 3D showcase of nine iconic places in
          Gujarat — each presented as a stylized scene you can move through, with
          a short story and the facts behind the legend.
        </p>

        <h2 className="mt-12 font-display text-3xl text-gold">The approach</h2>
        <p className="mt-3 leading-relaxed text-sand-200/80">
          These are not photoreal replicas. Every scene is built procedurally in
          the browser — from primitives, instanced geometry, and custom shaders —
          in a warm, storybook art direction with bloom and god-light. The goal
          is evocation, not imitation: a respectful, atmospheric impression that
          runs smoothly even on modest devices, where the interaction and the
          telling carry the experience.
        </p>

        <h2 className="mt-12 font-display text-3xl text-gold">What you can do</h2>
        <ul className="mt-3 space-y-2 text-sand-200/80">
          <li>· Move the sun across the sky at Modhera until it lights the sanctum.</li>
          <li>· Turn the silent white Rann of Kutch into the Rann Utsav festival.</li>
          <li>· Descend, level by level, into the queen's stepwell at Patan.</li>
          <li>· Shift Somnath and Dwarka from daylight to the evening aarti.</li>
          <li>· Climb Girnar and fill — or drain — the reservoirs of Dholavira.</li>
        </ul>

        <h2 className="mt-12 font-display text-3xl text-gold">A note on respect</h2>
        <p className="mt-3 leading-relaxed text-sand-200/80">
          Many of these places are living temples and sacred sites. The
          depictions here are intentionally interpretive and educational, made
          with admiration for the craftspeople, pilgrims, and communities who
          keep these legends alive.
        </p>

        <h2 className="mt-12 font-display text-3xl text-gold">The nine places</h2>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {places.map((p) => (
            <Link
              key={p.id}
              to={`/place/${p.id}`}
              className="rounded-lg border border-sand-500/15 bg-night-800/50 px-4 py-3 transition hover:border-gold/50"
            >
              <span className="font-display text-lg text-sand-50">{p.name}</span>
              <span className="block text-xs italic text-gold/80">{p.subtitle}</span>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <Link
            to="/"
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-night-900 transition hover:scale-105"
          >
            ← Back to the gallery
          </Link>
        </div>
      </div>
    </main>
  );
}
