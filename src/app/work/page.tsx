import { Work } from "@/components/sections/Work";
import { Navbar } from "@/components/layout/Navbar";

export default function WorkPage() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Work />
      </main>
    </div>
  );
}
