import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes intelligently.
 * This is the standard utility for all component styling in this project.
 * 
 * @example
 * cn("px-4 py-2", "px-6") // => "py-2 px-6" (px-6 overrides px-4)
 * cn("text-red-500", condition && "text-blue-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
