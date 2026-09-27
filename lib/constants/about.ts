/**
 * What the organization says about itself.
 *
 * Reproduced from the chapter's own About page rather than paraphrased. The
 * mission points in particular are the organization's own words about its own
 * purpose, and rewriting them to read better would be this site putting words
 * in the chapter's mouth.
 *
 * The one edit made is mechanical: the source runs the mission as a single
 * unbroken block, and it is split here into the five points it already was.
 */

export const ABOUT_INTRO =
  "We are a non-profit, tax-exempt organization registered in the USA, dedicated to " +
  "preserving and promoting Newah culture and heritage while supporting our community " +
  "both in America and Nepal.";

export const ABOUT_BACKGROUND =
  "In this rapidly changing world, our Newah community faces numerous challenges and " +
  "opportunities. We recognized the need for a relevant organization that could address " +
  "the aspirations of our community in the 21st century. NOA was established to meet " +
  "these needs, providing a platform for collective action and cultural preservation.";

export const MISSION_POINTS = [
  "Provide a democratic forum for the Newah community to advance in all fields of human " +
    "activities, honoring our rich historical heritage",
  "Work creatively and collectively with friends and well-wishers to address important " +
    "issues and secure the future for coming generations",
  "Advance the Newah community into the mainstream of American life while fostering " +
    "strong ties with our homeland Nepal",
  "Provide effective leadership and enhance the historical, socio-economic, cultural, " +
    "linguistic, educational, and technological foundations of our community",
  "Develop intelligent, compassionate, and creative Newah personas who contribute " +
    "positively to society",
] as const;

/** The membership tiers the chapter offers. */
export const MEMBERSHIP_TYPES = [
  "Regular",
  "Family",
  "Student",
  "Senior",
  "Lifetime",
] as const;

export type MembershipType = (typeof MEMBERSHIP_TYPES)[number];

export const MEMBERSHIP_BENEFITS = [
  "Connect with the Newah community in Northern California",
  "Participate in cultural events and celebrations",
  "Contribute to charitable initiatives supporting our community",
  "Access to exclusive member resources and networking opportunities",
  "Help preserve and promote Newah culture and heritage",
] as const;

/** What the chapter says donations pay for. */
export const DONATION_USES = [
  {
    title: "Cultural preservation",
    what: "Support programs that document and preserve Newah traditions, language, and arts.",
  },
  {
    title: "Community events",
    what: "Help fund cultural celebrations, educational workshops, and community gatherings.",
  },
  {
    title: "Charitable initiatives",
    what: "Support our humanitarian efforts and scholarship programs for the Newah community.",
  },
] as const;
