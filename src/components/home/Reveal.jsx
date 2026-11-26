import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Apparition douce au scroll (désactivée si l'utilisateur préfère réduire les animations). */
export function Reveal({ as = "div", delay = 0, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** En-tête de section homogène : sur-titre, titre + accent, texte. */
export function SectionHead({ kicker, title, accent, text, align = "left", id }) {
  return (
    <Reveal className={`hs-head hs-head-${align}`}>
      <span className="hs-kicker">{kicker}</span>
      <h2 id={id}>
        {title} {accent && <em>{accent}</em>}
      </h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
