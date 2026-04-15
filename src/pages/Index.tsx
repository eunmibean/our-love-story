import HeroSection from "@/components/wedding/HeroSection";
import InvitationCard from "@/components/wedding/InvitationCard";
import ContactSection from "@/components/wedding/ContactSection";
import GallerySection from "@/components/wedding/GallerySection";
import DateCountdown from "@/components/wedding/DateCountdown";
import LocationSection from "@/components/wedding/LocationSection";
import VenueInfo from "@/components/wedding/VenueInfo";
import AccountSection from "@/components/wedding/AccountSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import GuestbookSection from "@/components/wedding/GuestbookSection";
import WeddingFooter from "@/components/wedding/WeddingFooter";
import SectionDivider from "@/components/wedding/SectionDivider";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dot-pattern flex justify-center">
      <div className="w-full max-w-[480px] bg-background shadow-2xl shadow-black/30 min-h-screen">
        <HeroSection />
        <SectionDivider />
        <InvitationCard />
        <SectionDivider />
        <ContactSection />
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
        <RSVPSection />
        <SectionDivider />
        <GuestbookSection />
        <SectionDivider />
        <WeddingFooter />
      </div>
    </div>
  );
};

export default Index;
