import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
    </>
  );
}
