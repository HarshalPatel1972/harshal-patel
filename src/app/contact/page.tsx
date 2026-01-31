import { Contact } from "@/components/sections/Contact";
import { Navbar } from "@/components/layout/Navbar";

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Contact />
      </main>
    </div>
  );
}
