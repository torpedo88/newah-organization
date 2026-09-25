/**
 * What this site says about the Newars.
 *
 * Sourced, not remembered. Everything below comes from the Wikipedia articles
 * on the Newar people, Nepal Bhasa, Guthi, the Newar window and Ashtamangala,
 * read on 2026-09-25, plus the chapter's own material already in this repo.
 * `SOURCES` at the bottom is rendered on the page, so a reader can check any
 * of it.
 *
 * Two deliberate omissions.
 *
 * The Wikipedia article on Newar cuisine currently carries a banner saying it
 * may incorporate text from a large language model and may contain fabricated
 * references. Nothing here is taken from it. The food on this site stays with
 * what the chapter itself serves and names.
 *
 * Caste and the occupational groups are not enumerated. They are real and
 * central to how the society was organised, and they are also live and
 * contested, which makes them the community's to write about rather than a
 * website's to summarise in a card.
 */

export type Fact = {
  term: string;
  /** Nepal Bhasa or Devanagari, where the source gives one. */
  script?: string;
  body: string;
};

/** The opening: who, and where. */
export const WHO_THEY_ARE = {
  lede:
    "The Newars are the historic inhabitants of the Kathmandu Valley and the people who built " +
    "its cities — the temples, the squares and the towns that the rest of the world now " +
    "visits. They call themselves Newāh.",
  body: [
    "The valley and the country around it were the Newar kingdom of Nepal Mandala, until the " +
      "Gorkha conquest of 1768. The names travelled together: Nepal is the literary form and " +
      "Newar the colloquial one, and a Sanskrit inscription of 512 already greets “the " +
      "Nepals” as both a country and a people.",
    "They are not a single lineage but a civilisation — a society assembled over centuries " +
      "from the people who lived in the valley and those who arrived and stayed, holding a " +
      "language, a calendar and a way of organising a city in common.",
  ],
  stats: [
    { value: "1,341,363", label: "Newars in Nepal, 2021 census" },
    { value: "4.6%", label: "Of Nepal's population" },
    { value: "8th", label: "Largest group in the country" },
    { value: "166,000", label: "In India, 2006" },
  ],
} as const;

/** The things that hold it together. */
export const PILLARS: Fact[] = [
  {
    term: "Nepal Bhasa",
    script: "नेपाल भाषा",
    body:
      "The language, of the Tibeto-Burman branch — unrelated in family to Nepali, which is " +
      "Indo-Aryan, though the two have lived side by side for centuries. It carries a literature " +
      "of its own.",
  },
  {
    term: "Ranjana and Prachalit",
    body:
      "The scripts. Ranjana has been in use since the 12th century and Bhujimol since the 11th, " +
      "and the writing is old enough to predate the country it is written in.",
  },
  {
    term: "Nepal Sambat",
    body:
      "The era, begun in 879 AD and still counting — a calendar kept by a people rather than " +
      "a state. Its new year falls at Swanti, when Newars perform Mha Puja.",
  },
  {
    term: "Two faiths, one valley",
    body:
      "Newar Hinduism and Newar Buddhism are practised side by side, often by the same family at " +
      "the same shrine. Roughly nine in ten Newars are Hindu and one in ten Buddhist, and the " +
      "festivals belong to both.",
  },
  {
    term: "Guthi",
    script: "गुठी",
    body:
      "The institution that makes the rest of it run. A guthi is an association — historically " +
      "holding land in trust — that takes responsibility for a festival, a temple, a funeral " +
      "rite. Its eldest member is the thakali and its members are guthiyars. The system is far " +
      "older than the country; a 2019 bill to nationalise the guthis was withdrawn after Newars " +
      "filled the streets of the valley.",
  },
];

/** A life, as the community marks it. */
export const LIFE_RITUALS: Fact[] = [
  {
    term: "Ihi",
    script: "ईहि",
    body:
      "Performed for a girl between five and nine, a marriage to the bel fruit. She is never " +
      "afterwards a widow, whatever else life does.",
  },
  {
    term: "Bahra Chuyegu",
    script: "बराह चुयेगु",
    body: "As a girl approaches puberty, a second ceremony, and a second passage.",
  },
  {
    term: "Janku",
    body:
      "Old age, honoured rather than endured. The first is held at seventy-seven years, seven " +
      "months, seven days, seven hours, seven minutes and seven quarters — the precision is " +
      "the point, and the elder is carried through the town.",
  },
];

/** What the hands made. */
export const CRAFTS: Fact[] = [
  {
    term: "Paubha",
    body:
      "Devotional scroll painting. The earliest dated one to survive is a Vasudhara Mandala of " +
      "1365 AD — Nepal Sambat 485.",
  },
  {
    term: "Metal and wood",
    body:
      "Casting, repoussé and carving, well enough known that Newar artisans were sent for. " +
      "The valley's windows and struts are the same tradition as its bronzes.",
  },
  {
    term: "Dhime, khin, naykhin, dhaa",
    body:
      "The drums. Each has its own repertoire, and the dhime has a dance that goes with it. " +
      "Gunla Bajan bands play through the streets for the whole of Gunla, the tenth month of " +
      "Nepal Sambat and a holy month for Newar Buddhists.",
  },
  {
    term: "Pyakhan",
    body:
      "The dances: masked sacred dance, Dyah Pyakhan without masks, and Chachaa Pyakhan, which " +
      "is a meditation practice as much as a performance.",
  },
];

/** Shown on the page so a reader can check any of it. */
export const SOURCES = [
  { title: "Newar people", url: "https://en.wikipedia.org/wiki/Newar_people" },
  { title: "Nepal Bhasa", url: "https://en.wikipedia.org/wiki/Nepal_Bhasa" },
  { title: "Guthi", url: "https://en.wikipedia.org/wiki/Guthi" },
  { title: "Newar window", url: "https://en.wikipedia.org/wiki/Newar_window" },
  { title: "Newar architecture", url: "https://en.wikipedia.org/wiki/Newar_architecture" },
  { title: "Ashtamangala", url: "https://en.wikipedia.org/wiki/Ashtamangala" },
] as const;
