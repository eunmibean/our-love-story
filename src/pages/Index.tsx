import { useState, useEffect } from "react";
import HeroSection from "@/components/wedding/HeroSection_v2";
import InvitationCard from "@/components/wedding/InvitationCard";
import ContactSection from "@/components/wedding/ContactSection";
import OurStorySection from "@/components/wedding/OurStorySection";
import GallerySection from "@/components/wedding/GallerySection";
import DateCountdown from "@/components/wedding/DateCountdown";
import LocationSection from "@/components/wedding/LocationSection";
import VenueInfo from "@/components/wedding/VenueInfo";
import AccountSection from "@/components/wedding/AccountSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import RSVPInitialPopup from "@/components/wedding/RSVPInitialPopup";
import LoadingScreen from "@/components/wedding/LoadingScreen";

import SnapSection from "@/components/wedding/SnapSection";
import WeddingFooter from "@/components/wedding/WeddingFooter";
import SectionDivider from "@/components/wedding/SectionDivider";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[480px] shadow-2xl shadow-black/10 min-h-screen" style={{ backgroundImage: "url('/bg_img_white.jpg')", backgroundRepeat: "repeat", backgroundSize: "auto" }}>
        <HeroSection />
        <SectionDivider />
        <OurStorySection />
        <SectionDivider />
        <InvitationCard />
        <SectionDivider />
        <GallerySection />
        <SectionDivider />
        <DateCountdown />
        <SectionDivider />
        <RSVPSection />
        <SectionDivider />
        <LocationSection />
        <SectionDivider />
        <VenueInfo />
        <SectionDivider />
        <AccountSection />
        <ContactSection />
        <SectionDivider />
        <SnapSection />
        <SectionDivider />
        <WeddingFooter />
      </div>
      <RSVPInitialPopup />
      <LoadingScreen visible={isLoading} />
    </div>
  );
};

export default Index;
