import BookingFlow from "@/components/home/BookingFlow";
import CityMarkets from "@/components/home/CityMarkets";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedHotels />
      <CityMarkets />
      <BookingFlow />
    </>
  );
}
