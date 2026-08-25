export type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  type: "Apartment hotel" | "Villa" | "Serviced lodge";
  rating: number;
  reviews: number;
  price: number;
  priceLabel: string;
  image: string;
  tag: string;
  description: string;
  features: string[];
};

export const hotels: Hotel[] = [
  {
    id: "marina-collection-malaga",
    name: "Marina Collection Suites",
    city: "Malaga",
    country: "Spain",
    type: "Apartment hotel",
    rating: 4.9,
    reviews: 248,
    price: 30000,
    priceLabel: "$30,000 / 4 days",
    tag: "Guest favourite",
    description: "Contemporary suites close to Malaga's marina and historic centre.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    features: ["Ocean view", "Kitchen", "Free parking"],
  },
  {
    id: "costa-del-sol-villa",
    name: "Costa del Sol Private Villa",
    city: "Malaga",
    country: "Spain",
    type: "Villa",
    rating: 4.8,
    reviews: 192,
    price: 35000,
    priceLabel: "$35,000 / weekly stay",
    tag: "Top rated",
    description: "A spacious villa with a private pool, garden, and family-ready rooms.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    features: ["Private pool", "Garden", "Daily cleaning"],
  },
  {
    id: "gran-via-residences",
    name: "Gran Via Residences",
    city: "Barcelona",
    country: "Spain",
    type: "Apartment hotel",
    rating: 4.7,
    reviews: 316,
    price: 32000,
    priceLabel: "$32,000 / 4 days",
    tag: "City centre",
    description: "Well-connected serviced apartments for business and leisure stays.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    features: ["City views", "Workspace", "24-hour support"],
  },
  {
    id: "alfama-riverside-lodge",
    name: "Alfama Riverside Lodge",
    city: "Lisbon",
    country: "Portugal",
    type: "Serviced lodge",
    rating: 4.8,
    reviews: 176,
    price: 28000,
    priceLabel: "$28,000 / 4 days",
    tag: "Riverside stay",
    description: "A calm, design-led lodge near Lisbon's historic riverside district.",
    image:
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=1200&auto=format&fit=crop",
    features: ["Breakfast", "Airport transfer", "Wi-Fi"],
  },
  {
    id: "montmartre-city-suites",
    name: "Montmartre City Suites",
    city: "Paris",
    country: "France",
    type: "Apartment hotel",
    rating: 4.9,
    reviews: 421,
    price: 42000,
    priceLabel: "$42,000 / 4 days",
    tag: "Premium stay",
    description: "Elegant suites with full kitchens and quick access to central Paris.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    features: ["Concierge", "Kitchen", "Metro nearby"],
  },
  {
    id: "trastevere-courtyard-house",
    name: "Trastevere Courtyard House",
    city: "Rome",
    country: "Italy",
    type: "Villa",
    rating: 4.7,
    reviews: 138,
    price: 33000,
    priceLabel: "$33,000 / 4 days",
    tag: "Historic district",
    description: "A refined Roman stay with a peaceful private courtyard.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
    features: ["Courtyard", "Family rooms", "Air conditioning"],
  },
  {
    id: "canal-view-apartments",
    name: "Canal View Apartments",
    city: "Amsterdam",
    country: "Netherlands",
    type: "Apartment hotel",
    rating: 4.8,
    reviews: 267,
    price: 39000,
    priceLabel: "$39,000 / 4 days",
    tag: "Canal district",
    description: "Modern apartments positioned for easy access to Amsterdam's best areas.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    features: ["Canal view", "Bicycle storage", "Kitchen"],
  },
  {
    id: "vienna-garden-suites",
    name: "Vienna Garden Suites",
    city: "Vienna",
    country: "Austria",
    type: "Serviced lodge",
    rating: 4.9,
    reviews: 209,
    price: 31000,
    priceLabel: "$31,000 / 4 days",
    tag: "Quiet luxury",
    description: "A quiet serviced stay with elegant interiors and attentive local support.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
    features: ["Garden", "Gym access", "Breakfast"],
    },
  ];

  export const featuredHotels = hotels.slice(0, 4);

   export const cityMarkets = [
  {
    id: "malaga",
    name: "Malaga",
    city: "Malaga",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1000&auto=format&fit=crop",
    stays: 48,
    stayCount: "48 stays",
    description: "Coastal apartment hotels, villas, and premium serviced stays.",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop",
    stays: 36,
    stayCount: "36 stays",
    description: "Stylish city apartments close to culture, dining, and beaches.",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    city: "Lisbon",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1000&auto=format&fit=crop",
    stays: 29,
    stayCount: "29 stays",
    description: "Character-filled stays across Lisbon's historic neighbourhoods.",
  },
  {
    id: "paris",
    name: "Paris",
    city: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    stays: 42,
    stayCount: "42 stays",
    description: "Premium apartment hotels for memorable Paris city breaks.",
  },
];

export type Apartment = Hotel & {
  bedrooms: number;
  bathrooms: number;
  guests: number;
};

export const apartments: Apartment[] = [
  {
    id: "malaga-harbour-apartment",
    name: "Malaga Harbour Apartment",
    city: "Malaga",
    country: "Spain",
    type: "Apartment hotel",
    rating: 4.9,
    reviews: 184,
    price: 30000,
    priceLabel: "$30,000 / 4 days",
    tag: "Harbour view",
    description:
      "A refined two-bedroom apartment close to Malaga's marina, restaurants, and old town.",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop",
    features: ["Harbour view", "Full kitchen", "Fast Wi-Fi"],
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
  },
  {
    id: "barcelona-city-loft",
    name: "Barcelona City Loft",
    city: "Barcelona",
    country: "Spain",
    type: "Apartment hotel",
    rating: 4.8,
    reviews: 225,
    price: 32000,
    priceLabel: "$32,000 / 4 days",
    tag: "City centre",
    description:
      "A bright modern loft designed for guests who want Barcelona at their doorstep.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
    features: ["Workspace", "Balcony", "Air conditioning"],
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
  },
  {
    id: "lisbon-sunlit-residence",
    name: "Lisbon Sunlit Residence",
    city: "Lisbon",
    country: "Portugal",
    type: "Apartment hotel",
    rating: 4.8,
    reviews: 156,
    price: 28000,
    priceLabel: "$28,000 / 4 days",
    tag: "Guest favourite",
    description:
      "A quiet, comfortable city residence with thoughtful details for longer stays.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    features: ["Kitchen", "Laundry", "Airport transfer"],
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
  },
  {
    id: "paris-left-bank-suite",
    name: "Paris Left Bank Suite",
    city: "Paris",
    country: "France",
    type: "Apartment hotel",
    rating: 4.9,
    reviews: 298,
    price: 42000,
    priceLabel: "$42,000 / 4 days",
    tag: "Premium suite",
    description:
      "An elegant apartment suite with space, privacy, and easy access to central Paris.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
    features: ["Concierge", "City views", "Daily housekeeping"],
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
  },
];