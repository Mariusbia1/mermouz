import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import { recordVisit } from "../lib/portfolioApi";
import { useSiteContent } from "../hooks/useSiteContent";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const content = useSiteContent();

  useEffect(() => {
    recordVisit(location.pathname).catch(() => {
      // Les statistiques ne doivent jamais bloquer l’affichage du site.
    });
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="ambient">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <header className="site-nav">
        <div className="nav-inner">
          <Link className="brand" to="/">
            Marius BIAOU<em>.</em>
          </Link>
          <nav className={open ? "open" : ""}>
            {[
              ["/about", "À propos"],
              ["/services", "Services"],
              ["/works", "Projets"],
              ["/cv", "CV"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
            <NavLink
              className="mobile-nav-contact"
              to="/contact"
              onClick={() => setOpen(false)}
            >
              Me contacter
            </NavLink>
          </nav>
          <Link className="nav-contact" to="/contact">
            Me contacter <ArrowUpRight size={15} />
          </Link>
          <button className="mobile-menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="footer-inner">
          <Link className="brand" to="/">
            Marius BIAOU<em>.</em>
          </Link>
          <span>
            {content.profile.fullName} · {content.profile.location}
          </span>
          <div className="social-links">
            {content.social.github && (
              <a
                href={content.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            )}
            {content.social.facebook && (
              <a
                href={content.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
            )}
            {content.social.linkedin && (
              <a
                href={content.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            )}
            {content.social.whatsapp && (
              <a
                href={content.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            )}
          </div>
          <small>© 2026. Tous droits réservés</small>
        </div>
      </footer>
    </>
  );
}
