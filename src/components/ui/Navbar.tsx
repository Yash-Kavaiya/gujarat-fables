import { Link } from 'react-router-dom';
import QualityToggle from './QualityToggle';

interface NavbarProps {
  /** Show a back-to-gallery link instead of the section anchors */
  variant?: 'home' | 'place';
}

export default function Navbar({ variant = 'home' }: NavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8">
      <Link
        to="/"
        className="group flex items-center gap-2.5 text-sand-100"
        aria-label="Gujarat Fable — home"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-sand-200 to-terracotta-500 font-display text-lg font-semibold text-night-900 shadow-lg">
          ગ
        </span>
        <span className="font-display text-xl tracking-wide">
          Gujarat <span className="text-gold">Fable</span>
        </span>
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        {variant === 'place' ? (
          <Link
            to="/"
            className="rounded-full border border-sand-500/30 bg-night-800/70 px-3 py-1.5 text-xs font-medium text-sand-100 backdrop-blur transition hover:border-gold/60 hover:text-gold"
          >
            ← All places
          </Link>
        ) : (
          <Link
            to="/about"
            className="rounded-full border border-sand-500/30 bg-night-800/70 px-3 py-1.5 text-xs font-medium text-sand-100 backdrop-blur transition hover:border-gold/60 hover:text-gold"
          >
            About
          </Link>
        )}
        <QualityToggle />
      </nav>
    </header>
  );
}
