/**
 * The chapter's officers, members and advisors.
 *
 * Taken verbatim from the roster the chapter publishes on its own site, for
 * the 2023–2026 term. Names and the city each person is in are reproduced as
 * published there, on the owner's instruction (2026-09-25).
 *
 * Two things to keep in mind whenever this list is edited:
 *
 * 1. These are living people. A name here is a real person's name against the
 *    town they live in, so a correction or a removal is not a cosmetic change
 *    and should be made the day it is asked for.
 * 2. Honorifics are kept as the chapter writes them, including "Dr." — it is
 *    how the organization refers to its own people, and normalising them would
 *    be this site inventing a convention the chapter does not use.
 */

export type Person = {
  name: string;
  /** Officers only. */
  role?: string;
  /** The city the chapter lists for this person. */
  city?: string;
};

/** The term the published roster covers. */
export const BOARD_TERM = "2023–2026";

export const EXECUTIVE_BOARD: Person[] = [
  { name: "Mr. Madan Maharjan", role: "President", city: "Santa Rosa" },
  { name: "Mr. Yagya Raj Shrestha", role: "1st Vice President", city: "Roseville" },
  { name: "Mr. Roshan Joshi", role: "2nd Vice President", city: "Santa Rosa" },
  { name: "Mr. Rajendra K. Shrestha", role: "General Secretary", city: "Santa Rosa" },
  { name: "Mr. Krishna Maharjan", role: "Secretary", city: "Richmond" },
  { name: "Mr. Suraj K Mali", role: "Treasurer", city: "Santa Rosa" },
];

export const MEMBERS: Person[] = [
  { name: "Mr. Abhishek Maharjan", city: "Berkeley" },
  { name: "Mr. Anup Kumar Joshi", city: "Santa Rosa" },
  { name: "Mr. Bikash Maharjan", city: "Santa Rosa" },
  { name: "Mr. Bimal Shrestha", city: "San Francisco" },
  { name: "Mr. Bitals Maharjan", city: "San Pablo" },
  { name: "Mrs. Gauri Manandhar", city: "San Francisco" },
  { name: "Mrs. Gita Dongol", city: "Berkeley" },
  { name: "Mr. Kedar Maharjan", city: "Santa Rosa" },
  { name: "Mr. Mani Raj Maharjan", city: "El Cerrito" },
  { name: "Mrs. Manju Maharjan", city: "Santa Rosa" },
  { name: "Mr. Niroj Maharjan", city: "Santa Rosa" },
  { name: "Mrs. Reena Joshi Pradhan", city: "Santa Rosa" },
  { name: "Mr. Sanjip Maharjan", city: "Santa Rosa" },
  { name: "Dr. Subodh Shrestha", city: "Santa Rosa" },
  { name: "Mrs. Sunita Bajracharya", city: "Berkeley" },
];

/** The advisors are published without cities. */
export const ADVISORS: Person[] = [
  { name: "Mr. Deben Shrestha" },
  { name: "Mr. Bhoopati Rajopadhyaya" },
  { name: "Mr. Buddha Maharjan" },
  { name: "Mr. Dikendra Maskey" },
  { name: "Mr. Narayan Somname" },
  { name: "Mr. Ram Shrestha" },
  { name: "Mr. Sameer Maharjan" },
  { name: "Mr. Sunil Rajkarnikar" },
  { name: "Mr. Yagya Lal Shrestha" },
];
