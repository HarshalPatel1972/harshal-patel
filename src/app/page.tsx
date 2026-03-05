import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollLine } from "@/components/AnimationKit";
import { Preloader } from "@/components/Preloader";

export default function Home() {
  return (
    <main>
      <Preloader />
      <ScrollLine />
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
