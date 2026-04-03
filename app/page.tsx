import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MapShowcase } from "@/components/landing/MapShowcase";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export default function HomePage() {
  return (
    <ToastProvider>
      <main>
        <Hero />
        <HowItWorks />
        <MapShowcase />
        <CTASection />
        <Footer />
      </main>
    </ToastProvider>
  );
}
