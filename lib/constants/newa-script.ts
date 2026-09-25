/**
 * Text in the Newa script.
 *
 * Two facts that decide everything in this file, both checked rather than
 * remembered, on 2026-09-25:
 *
 * 1. **Ranjana is not in Unicode.** The standard's own Blocks.txt has no entry
 *    for it. Anything labelled "Ranjana" on the web is either an image or a
 *    font mapping private-use codepoints, which breaks copy and paste, search
 *    and screen readers. On this site Ranjana can only be artwork.
 * 2. **Newa is encoded**, at U+11400-U+1147F, and Google serves Noto Sans Newa.
 *    So Newa can be real text: selectable, searchable, and announced.
 *
 * And one rule about what goes in here.
 *
 * Every string below is copied from a published source and every codepoint is
 * checked to sit inside the Newa block. Nothing is composed. Writing invented
 * Nepal Bhasa in the community's own script, on the community's own site, is
 * the one error the people this is for would notice immediately — so the file
 * holds only what can be cited, and the rest waits for someone who reads it.
 */

/**
 * The endonym: Newāḥ.
 *
 * From the Wikipedia article on the Newar people, which gives it as
 * `Newar: 𑐣𑐾𑐰𑐵𑑅, Devanagari: नेवाः`. Codepoints U+11423 U+1143E U+11430
 * U+11435 U+11445, all inside the Newa block.
 */
export const NEWA_ENDONYM = "\u{11423}\u{1143E}\u{11430}\u{11435}\u{11445}";

/** The same word in Devanagari, which is how Nepal Bhasa is usually written today. */
export const NEWA_ENDONYM_DEVANAGARI = "नेवाः";

/** Romanised, for anyone without the font. */
export const NEWA_ENDONYM_LATIN = "Newāḥ";

/**
 * The hero's headline, in Nepal Bhasa.
 *
 * Deliberately empty. The English reads "Our culture, tradition & heritage —
 * our pride", and translating that into Nepal Bhasa is not something this
 * codebase can do honestly: a wrong translation in the heritage script is
 * worse than an honest English line.
 *
 * To fill it: put the Nepal Bhasa wording here as a board member writes it,
 * in the Newa script if they write it in Newa and in Devanagari if they do not.
 * The hero renders it above the English the moment it is non-empty, and
 * `script` says which of the two it is so the right font and lang are used.
 */
export const HERO_HEADLINE_NEPAL_BHASA: {
  text: string;
  script: "newa" | "devanagari";
  /** Who supplied it, so the next person knows it was not invented here. */
  source: string;
} = {
  text: "",
  script: "newa",
  source: "",
};
