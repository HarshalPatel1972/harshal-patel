import { About } from "@/components/sections/About";
import { Navbar } from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <main className="pt-20">
        <About />
      </main>
    </div>
  );
}
