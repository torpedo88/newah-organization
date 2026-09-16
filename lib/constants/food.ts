export const FOOD_OPTIONS = [
  { id: "dal-bhat", label: "Dal Bhat" },
  { id: "chicken-curry", label: "Chicken Curry" },
  { id: "vegetarian-special", label: "Vegetarian Special" },
] as const;

export type FoodOptionId = typeof FOOD_OPTIONS[number]["id"];

export const DONATION_AMOUNTS = [10, 25, 50, 100] as const;

export type DonationAmount = typeof DONATION_AMOUNTS[number];
