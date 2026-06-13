/** Shared tuning constants used by both the DOM controls and the 3D scenes. */

/** sunAngle value at which Modhera's dawn beam reaches the sanctum. */
export const MODHERA_EQUINOX = 0.06;
/** How close to the equinox angle still counts as "the sanctum is lit". */
export const MODHERA_LIT_RANGE = 0.05;

/** Rani ki Vav descent: number of levels below the top (0 … MAX). */
export const RANI_MAX_LEVEL = 6;

/** Girnar climb story beats, unlocked as `climb` (0…1) increases. */
export const GIRNAR_BEATS = [
  { at: 0, label: 'The foot of the mountain' },
  { at: 0.34, label: 'The Jain temples & Neminath' },
  { at: 0.67, label: 'Amba Mata’s shrine' },
  { at: 0.92, label: 'Dattatreya — the highest peak' },
];
