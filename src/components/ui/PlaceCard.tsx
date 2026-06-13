import { Link } from 'react-router-dom';
import type { Place } from '../../data/places';

/**
 * Gallery card for a place. The "cover" is a pure-CSS gradient mini-scene built
 * from the place's palette — fast, no images, and on-theme.
 */
export default function PlaceCard({ place, index }: { place: Place; index: number }) {
  const { palette } = place;
  return (
    <Link
      to={`/place/${place.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-sand-500/15 bg-night-800 shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-2xl focus-visible:-translate-y-1"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Palette cover with a stylized horizon + silhouette */}
      <div
        className="relative h-44 w-full"
        style={{
          background: `linear-gradient(to bottom, ${palette.sky} 0%, ${palette.sky} 45%, ${palette.ground} 46%, ${palette.ground} 100%)`,
        }}
        aria-hidden="true"
      >
        <span
          className="absolute bottom-0 left-1/2 h-20 w-24 -translate-x-1/2"
          style={{
            background: palette.fog,
            clipPath: 'polygon(50% 0%, 78% 60%, 100% 100%, 0% 100%, 22% 60%)',
            opacity: 0.85,
          }}
        />
        <span
          className="absolute right-6 top-6 h-10 w-10 rounded-full"
          style={{ background: palette.accent, boxShadow: `0 0 30px ${palette.accent}` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night-900/85 via-transparent to-transparent" />
        <span className="absolute left-4 top-3 rounded-full bg-night-900/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-sand-100 backdrop-blur">
          {place.region}
        </span>
        {place.hero && (
          <span className="absolute right-4 top-3 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-night-900">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-2xl leading-tight text-sand-50">{place.name}</h3>
        <p className="mt-0.5 text-xs italic text-gold/90">{place.subtitle}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-sand-200/80">
          {place.shortDesc}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-sand-300/60">{place.district} district</span>
          <span className="text-sm font-medium text-gold transition group-hover:translate-x-0.5">
            Enter →
          </span>
        </div>
      </div>
    </Link>
  );
}
