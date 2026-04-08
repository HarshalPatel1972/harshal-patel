import { Suspense } from "react";
import { FeedbackContents } from "./FeedbackContents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback Hub | Harshal Patel",
  description: "A professional, cinematic platform for sharing thoughts, reports, and feature requests. Editorial brutalist design with immersive feedback loops.",
};

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-black uppercase tracking-[1em] text-black">Entering Gallery...</div>}>
      <FeedbackContents />
    </Suspense>
  );
}
