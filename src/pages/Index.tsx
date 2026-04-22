import HeroSection from "@/components/wedding/HeroSection";
import InvitationCard from "@/components/wedding/InvitationCard";
import ContactSection from "@/components/wedding/ContactSection";
import OurStorySection from "@/components/wedding/OurStorySection";
import GallerySection from "@/components/wedding/GallerySection";
import DateCountdown from "@/components/wedding/DateCountdown";
import LocationSection from "@/components/wedding/LocationSection";
import VenueInfo from "@/components/wedding/VenueInfo";
import AccountSection from "@/components/wedding/AccountSection";

import SnapSection from "@/components/wedding/SnapSection";
import WeddingFooter from "@/components/wedding/WeddingFooter";
import SectionDivider from "@/components/wedding/SectionDivider";

const Index = () => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[480px] bg-background shadow-2xl shadow-black/10 min-h-screen">
        <HeroSection />
        <SectionDivider />
        <InvitationCard />
        <SectionDivider />
        <ContactSection />
        <SectionDivider />
        <OurStorySection />
        <SectionDivider />
        <GallerySection />
        <SectionDivider />
        <DateCountdown />
        <SectionDivider />
        <LocationSection />
        <SectionDivider />
        <VenueInfo />
        <SectionDivider />
        <AccountSection />
        <SectionDivider />
        <SnapSection />
        <SectionDivider />
        <WeddingFooter />
      </div>
    </div>
  );
};

export default Index;
