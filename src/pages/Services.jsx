import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { portfolioServices } from "../data/services";
import { pageMotion } from "../config/motion";
import { getServices } from "../lib/portfolioApi";
export default function Services() {
  const [services, setServices] = useState(portfolioServices);
  useEffect(() => {
    getServices({ activeOnly: true })
      .then((data) =>
        setServices(
          data.map((item) => ({
            ...item,
            short: item.short_description,
            icon:
              portfolioServices.find((service) => service.slug === item.slug)
                ?.icon || portfolioServices[0].icon,
          })),
        ),
      )
      .catch(() => {});
  }, []);
  return (
    <motion.main className="page inner-page services-page" {...pageMotion}>
      <header className="page-head services-head">
        <span>SERVICES</span>
        <h1>
          Des solutions adaptées
          <br />
          <em>à votre activité.</em>
        </h1>
        <p>
          Du site professionnel à la solution sur mesure, je vous aide à choisir
          et construire ce qui répond réellement à votre objectif.
        </p>
      </header>
      <section className="services-list">
        {services.map(({ slug, title, short, icon: Icon }) => (
          <Link className="service-row" to={`/services/${slug}`} key={slug}>
            <div className="service-icon">
              <Icon />
            </div>
            <div className="service-copy">
              <h2>{title}</h2>
              <p>{short}</p>
            </div>
            <span className="service-more">
              Découvrir <ArrowUpRight />
            </span>
          </Link>
        ))}
      </section>
    </motion.main>
  );
}
