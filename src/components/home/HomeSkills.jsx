import React from "react";
import { Reveal, SectionHead } from "./Reveal";

export default function HomeSkills({ content }) {
  const skills = content.cv.skills ?? [];
  if (!skills.length) return null;

  return (
    <section className="hs-section hs-skills-wrap" aria-labelledby="home-skills-title">
      <SectionHead
        id="home-skills-title"
        kicker="COMPÉTENCES"
        title="Les outils que je maîtrise"
        accent="pour construire votre projet."
      />
      <div className="hs-skills">
        {skills.map(({ title, text }, index) => (
          <Reveal className="hs-skill" key={title} delay={(index % 4) * 0.06}>
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
