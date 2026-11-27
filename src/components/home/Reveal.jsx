import React from "react";

/**
 * Wrapper d'animation au scroll propulsé par AOS (Animate On Scroll).
 * Accepte `aos` (fade-up, fade-right, fade-left, zoom-in-up, zoom-in...)
 * et `delay` en secondes (converti en ms pour data-aos-delay).
 */
export function Reveal({
  as = "div",
  aos = "fade-up",
  delay = 0,
  duration,
  className,
  children,
  ...rest
}) {
  const Tag = as;
  const delayMs = delay ? Math.round(delay * 1000) : undefined;
  return (
    <Tag
      className={className}
      data-aos={aos}
      data-aos-delay={delayMs}
      data-aos-duration={duration}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** En-tête de section homogène : sur-titre, titre + accent, texte. */
export function SectionHead({
  kicker,
  title,
  accent,
  text,
  align = "left",
  id,
  aos = "fade-up",
}) {
  return (
    <Reveal className={`hs-head hs-head-${align}`} aos={aos}>
      <span className="hs-kicker">{kicker}</span>
      <h2 id={id}>
        {title} {accent && <em>{accent}</em>}
      </h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
