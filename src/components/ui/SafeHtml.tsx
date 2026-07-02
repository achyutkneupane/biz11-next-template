"use client";

import DOMPurify from "dompurify";
import { useEffect, useState, type ElementType } from "react";

type SafeHtmlProps = {
  html: string;
  className?: string;
  as?: ElementType;
};

export function SafeHtml({ html, className, as: Component = "div" }: SafeHtmlProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Prevent SSR mismatch by rendering safely before hydration
  if (!isMounted) {
    return <Component className={className}>{html}</Component>;
  }

  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
