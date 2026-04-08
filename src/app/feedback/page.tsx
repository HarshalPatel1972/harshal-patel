import { Suspense } from "react";
import { FeedbackContents } from "./FeedbackContents";

export const metadata = {
  title: "The Message Void | Feedback Hub",
  description: "An immersive, floating gallery for community reviews, bug reports, and feature requests.",
};

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-black uppercase tracking-[1em] text-black">Entering Gallery...</div>}>
      <FeedbackContents />
    </Suspense>
  );
}
