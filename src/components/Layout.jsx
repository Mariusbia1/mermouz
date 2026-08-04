import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import { recordVisit } from "../lib/portfolioApi";
import { useSiteContent } from "../hooks/useSiteContent";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previousBehavior;
  }, [pathname]);

  return null;
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();
  const content = useSiteContent();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

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
      <ScrollToTop />
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
          <div className="nav-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={
                theme === "dark"
                  ? "Activer le mode clair"
                  : "Activer le mode sombre"
              }
              title={theme === "dark" ? "Mode clair" : "Mode sombre"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            <Link className="nav-contact" to="/contact">
              Me contacter <ArrowUpRight size={15} />
            </Link>
          </div>
          <button
            className="mobile-menu"
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
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
          <small>
            <span>© 2026. Tous droits réservés</span>
            <Link to="/confidentialite">Confidentialité</Link>
          </small>
        </div>
      </footer>
    </>
  );
}
