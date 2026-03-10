"use client";

import { useEffect } from "react";

/**
 * ImageGuard Component
 * 
 * Implements a global protection layer for images and visual assets.
 * - Disables Right-Click context menu on all images/SVGs
 * - Disables image dragging (ghosting/downloading directly)
 * - Prevents standard text selection on visual-only containers
 */
export default function ImageGuard() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // If the target is an image, SVG, or inside a visual container
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" || 
        target.tagName === "SVG" || 
        target.closest("picture") ||
        target.classList.contains("ink-slash") ||
        target.classList.contains("manga-panel")
      ) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" || 
        target.tagName === "SVG" || 
        target.closest("picture")
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null;
}
