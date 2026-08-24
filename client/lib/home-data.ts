export type FeaturedHotel = {
  id: string;
  name: string;
  location: string;
  price: string;
  image: string;
  rating: string;
  features: string[];
};

export type CityMarket = {
  city: string;
  country: string;
  stays: string;
  image: string;
};

export const featuredHotels: FeaturedHotel[] = [
  {
    id: "malaga-luxury-villas",
    name: "Luxury Villas Malaga",
    location: "Malaga, Spain",
    price: "$30,000 / 4 days",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
    rating: "4.9",
    features: ["Free Wi-Fi", "Kitchenettes", "Airport pickup", "Secure parking"],
  },
  {
    id: "malaga-premium-suites",
    name: "Malaga Premium Suites",
    location: "Malaga, Spain",
    price: "$35,000 / weekly",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop",
    rating: "4.8",
    features: ["Smart TVs", "King-size beds", "24/7 power", "On-site dining"],
  },
  {
    id: "barcelona-urban-residence",
    name: "Barcelona Urban Residence",
    location: "Barcelona, Spain",
    price: "$2,900 / night",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop",
    rating: "4.7",
    features: ["City center", "Rooftop pool", "Concierge", "Family suites"],
  },
  {
    id: "paris-rive-gauche-aparthotel",
    name: "Paris Rive Gauche Aparthotel",
    location: "Paris, France",
    price: "$3,400 / night",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1400&auto=format&fit=crop",
    rating: "4.8",
    features: ["Metro access", "Kitchen studios", "Workspace", "Laundry"],
  },
];

export const cityMarkets: CityMarket[] = [
  {
    city: "Malaga",
    country: "Spain",
    stays: "42 curated stays",
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    city: "Lisbon",
    country: "Portugal",
    stays: "31 curated stays",
    image:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    stays: "28 curated stays",
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    city: "Rome",
    country: "Italy",
    stays: "36 curated stays",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop",
  },
];
