import React from "react";
import { Compass, PenTool, Rocket, Search } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

export default function HomeProcess({ content }) {
  const { about } = content;
  const steps = [
    { icon: Search, title: about.methodDiscoveryTitle, text: about.methodDiscoveryText },
    { icon: Compass, title: about.methodDirectionTitle, text: about.methodDirectionText },
    { icon: PenTool, title: about.methodCreationTitle, text: about.methodCreationText },
    { icon: Rocket, title: about.methodDeliveryTitle, text: about.methodDeliveryText },
  ].filter((step) => step.title);

  return (
    <section className="hs-section" aria-labelledby="home-process-title">
      <SectionHead
        id="home-process-title"
        align="center"
        kicker="MA MÉTHODE"
        title="Un projet clair,"
        accent="du premier échange à la mise en ligne."
        text={about.methodIntro}
      />
      <ol className="hs-process">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <Reveal as="li" className="hs-step" key={title} delay={index * 0.08}>
            <div className="hs-step-top">
              <span className="hs-step-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
