import Container from "@/components/common/Container";
import HeroSection from "@/components/home/HeroSection";

export default function HomeScreen() {
  return (
    <Container edges={["bottom", "left", "right"]}>
      <HeroSection />
    </Container>
  );
}