/**
 * Photograph attribution.
 *
 * Every image HERE is Creative Commons licensed and REQUIRES attribution. It
 * is not every image on the site: the chapter's own photographs live in
 * COMMUNITY_PHOTOS and carry no licence condition, only photographers worth
 * thanking.
 * Rendering these credits is a licence condition, not a courtesy — removing
 * them breaches the terms the photographs are used under.
 *
 * Keep in step with docs/PHOTO-CREDITS.md.
 */
export type PhotoCredit = {
  file: string;
  photographer: string;
  licence: string;
  licenceUrl: string;
  sourceUrl: string;
};

export const PHOTO_CREDITS: PhotoCredit[] = [
  {
    file: "gai-jatra.jpg",
    photographer: "NareshKTha",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Gaijatra1.jpg",
  },
  {
    file: "patan-durbar.jpg",
    photographer: "Shadow Ayush",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Big_Bell,_Patan_Durbar_Square_in_the_evening.jpg",
  },
  {
    file: "mha-puja.jpg",
    photographer: "Kamal Ratna Tuladhar",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mhapuja_bhoy.jpg",
  },
  {
    file: "indra-jatra-durbar-square.webp",
    photographer: "Wikimedman",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Start_of_Indra_Jatra.jpg",
  },
];
