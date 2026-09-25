/**
 * Newah architectural and iconographic motifs.
 *
 * Sourced rather than remembered. Every name and gloss below comes from the
 * Wikipedia articles on the Newar window, Newar architecture and Ashtamangala,
 * read on 2026-09-25 — the transliterations in particular are easy to get
 * subtly wrong, and a site about a culture should not misspell that culture's
 * own words.
 *
 * Note on one of them: the carved lattice is *Tikijhyā*, not "chikijya". Both
 * Tikijhyā and Ankhi Jhyā appear in usage for it.
 */

/** The window types, as the tradition distinguishes them. */
export const NEWAR_WINDOWS = [
  {
    name: "Sanjhyā",
    devanagari: "सँझ्या",
    what:
      "The classic Newar window: a projecting bay of three units, set in the middle of a " +
      "facade, its latticed shutter opening upwards. Usually the third floor.",
  },
  {
    name: "Tikijhyā",
    devanagari: "तिकिझ्या",
    what:
      "The lattice window, and the most common of them. It lets in light and air and keeps " +
      "out the eyes of anyone passing. Usually the second floor.",
  },
  {
    name: "Gājhyā",
    devanagari: "गाझ्या",
    what: "A projecting window, set under the roof.",
  },
  {
    name: "Pāsukhā Jhyā",
    devanagari: "पासुखा झ्या",
    what:
      "A small window of five units, for the Pancha Buddha. Mostly on the shrine houses of " +
      "monasteries.",
  },
] as const;

/**
 * The three windows the valley singles out by name.
 *
 * Kept separate from the types above because these are individual objects in
 * specific buildings, not categories.
 */
export const FAMOUS_WINDOWS = [
  {
    name: "Desay Madu Jhyā",
    where: "Kathmandu",
    what: "Its name means “the only window of its kind in the country”.",
  },
  {
    name: "Lunjhyā",
    where: "Patan Durbar",
    what: "The golden window.",
  },
  {
    name: "Mhaykhā Jhyā",
    where: "Bhaktapur",
    what: "The peacock window, its fan-tailed bird carved from a single block.",
  },
] as const;

/**
 * Asta Mangal — the eight auspicious signs.
 *
 * Shared across Buddhism, Hinduism and Jainism, and worked into Newah doorways,
 * metalwork and ritual. They are sacred signs, not ornament: named here with
 * what each one carries, rather than scattered across the page as decoration.
 */
export const ASTA_MANGAL = [
  { name: "Chhatra", english: "Parasol", meaning: "Shelter, and protection from suffering" },
  { name: "Suvarnamatsya", english: "Golden fish", meaning: "Freedom, and fearlessness in the water" },
  { name: "Shankha", english: "Conch", meaning: "The teaching, carrying far" },
  { name: "Shrivatsa", english: "Endless knot", meaning: "Everything bound to everything else" },
  { name: "Dhvaja", english: "Victory banner", meaning: "Wisdom over ignorance" },
  { name: "Kalasha", english: "Treasure vase", meaning: "Abundance that does not run out" },
  { name: "Padma", english: "Lotus", meaning: "Rising clean out of muddy water" },
  { name: "Dharmachakra", english: "Wheel", meaning: "The turning of the teaching" },
] as const;

/**
 * The eight, as files.
 *
 * Separate from ASTA_MANGAL above because that list is what the signs mean and
 * this one is what is on disk. `slug` is the filename in
 * public/images/asta-mangal.
 */
export const ASTA_MANGAL_MARKS = [
  { slug: "parasol", name: "Chhatra" },
  { slug: "golden-fish", name: "Suvarnamatsya" },
  { slug: "conch", name: "Shankha" },
  { slug: "endless-knot", name: "Shrivatsa" },
  { slug: "victory-banner", name: "Dhvaja" },
  { slug: "treasure-vase", name: "Kalasha" },
  { slug: "lotus", name: "Padma" },
  { slug: "wheel", name: "Dharmachakra" },
] as const;
