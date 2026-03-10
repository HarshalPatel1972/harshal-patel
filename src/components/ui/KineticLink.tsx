"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface KineticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  delay?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  // This allows passing additional group states if needed
  isExternal?: boolean;
}

/**
 * KineticLink Component
 * 
 * Implements a "Kinetic Navigation" delay for intentional UI feedback.
 * - Triggers an 'active' state immediately on click.
 * - Forces a Global Impact Flash.
 * - Delays navigation to allow active/hover animations to play out.
 */
export function KineticLink({ 
  href, 
  children, 
  className = "", 
  target, 
  delay = 500, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  isExternal = false
}: KineticLinkProps) {
  const router = useRouter();
  const [isCashed, setIsCashed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Fire custom click logic if provided
    if (onClick) onClick(e);

    // 2. Determine if we should handle navigation or let native mailto/etc take over
    const isSpecialLink = href.startsWith('mailto:') || href.startsWith('tel:');
    
    // 3. Handle navigation delay for standard links
    if (!isSpecialLink) {
      e.preventDefault();
      setIsCashed(true);

      setTimeout(() => {
        if (target === "_blank" || isExternal) {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          router.push(href);
        }
        // Reset state after a moment unsheathed
        setTimeout(() => setIsCashed(false), 300);
      }, delay);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`${className} ${isCashed ? 'kinetic-active' : ''}`}
    >
      {children}
    </a>
  );
}
