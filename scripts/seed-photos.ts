import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const photos = [
  {
    slug: "indra-jatra-kumari",
    image_url: "/images/community/indra-jatra-2023-kumari.jpg",
    alt_text: "A young girl dressed as the Kumari in red and gold, hands joined, at the chapter's Indra Jatra in Berkeley",
    credit: null,
    display_order: 0,
    published: true,
  },
  {
    slug: "nepal-day-banner",
    image_url: "/images/community/nepal-day-parade-banner.jpg",
    alt_text: "Members holding the Newah Organization of America Northern California Chapter banner at the Nepal Day Parade in San Francisco, a Lakhey dancing behind them",
    credit: "Bharat Adhikari Photography",
    display_order: 1,
    published: true,
  },
  {
    slug: "indra-jatra-lakhey",
    image_url: "/images/community/indra-jatra-2023-lakhey.jpg",
    alt_text: "A Lakhey dancer in a red mask with white mane, dancing among the crowd at Berkeley Marina",
    credit: null,
    display_order: 2,
    published: true,
  },
  {
    slug: "dhime-drummers",
    image_url: "/images/community/dhime-drummers-sf.jpg",
    alt_text: "Dhime drummers with the chapter's own drums, standing with the Kumari at San Francisco Civic Center",
    credit: "Bharat Adhikari Photography",
    display_order: 3,
    published: true,
  },
  {
    slug: "ihi-ceremony",
    image_url: "/images/community/ihi-ceremony.jpg",
    alt_text: "Hands in red and gold bangles tying the sacred thread during an Ihi ceremony",
    credit: null,
    display_order: 4,
    published: true,
  },
  {
    slug: "haku-patasi",
    image_url: "/images/community/haku-patasi-market-street.jpg",
    alt_text: "Five members in haku patasi, the black and red Newar sari, on Market Street in San Francisco",
    credit: null,
    display_order: 5,
    published: true,
  },
  {
    slug: "lakhey-crowd",
    image_url: "/images/community/indra-jatra-2023-lakhey-crowd.jpg",
    alt_text: "The Lakhey dancing before families and children on the grass at Berkeley Marina",
    credit: null,
    display_order: 6,
    published: true,
  },
  {
    slug: "nepal-day-group",
    image_url: "/images/community/nepal-day-parade-group.jpg",
    alt_text: "The chapter gathered in front of San Francisco City Hall at the Nepal Day Parade, with Nepali and American flags and two Lakhey",
    credit: "Bharat Adhikari Photography",
    display_order: 7,
    published: true,
  },
];

async function seedPhotos() {
  try {
    console.log("Seeding community photos...");

    const { error } = await supabase.from("community_photos").insert(photos);

    if (error) {
      console.error("Error seeding photos:", error);
      process.exit(1);
    }

    console.log("Successfully seeded 8 community photos");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedPhotos();
