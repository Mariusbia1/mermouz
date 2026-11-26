import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";

export default function HomeAbout({ content }) {
  const { profile, about, cv } = content;
  const degree = cv.education?.[0];
  const facts = [
    { icon: BriefcaseBusiness, label: "Aujourd’hui", value: profile.job },
    degree && {
      icon: GraduationCap,
      label: "Formation",
      value: `${degree.title} · ${degree.place}`,
    },
    { icon: MapPin, label: "Basé à", value: `${profile.location} · missions à distance` },
  ].filter(Boolean);

  return (
    <section className="hs-section hs-about" aria-labelledby="home-about-title">
      <Reveal className="hs-about-copy">
        <span className="hs-kicker">QUI SUIS-JE</span>
        <h2 id="home-about-title">
          {about.title} <em>{about.accent}</em>
        </h2>
        <p className="hs-about-lead">{about.opening}</p>
        <p>{about.passion}</p>
        <Link className="hs-link" to="/about">
          Découvrir mon parcours <ArrowRight />
        </Link>
      </Reveal>

      <Reveal className="hs-about-facts" delay={0.1}>
        {facts.map(({ icon: Icon, label, value }) => (
          <div className="hs-fact" key={label}>
            <span className="hs-fact-icon">
              <Icon />
            </span>
            <div>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
