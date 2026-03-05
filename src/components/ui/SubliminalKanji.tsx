"use client";

interface SubliminalKanjiProps {
  kanji: string;
  position?: "left" | "right";
  className?: string;
}

export function SubliminalKanji({ kanji, position = "left", className = "" }: SubliminalKanjiProps) {
  return (
    <div 
      className={`absolute top-0 bottom-0 w-24 md:w-48 overflow-hidden pointer-events-none select-none z-0 mix-blend-difference flex flex-col justify-between py-12 ${
        position === "left" ? "left-0" : "right-0"
      } ${className}`}
    >
      <div 
        className="text-[6rem] md:text-[12rem] font-black text-white opacity-[0.03] leading-[0.8] break-words text-center flex-1 flex flex-col items-center justify-around"
        style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
      >
        {kanji}
      </div>
    </div>
  );
}
