import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import { recordVisit, recordVisitorEvent } from "../lib/portfolioApi";
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
    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 70,
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  useEffect(() => {
    const t1 = window.setTimeout(() => AOS.refreshHard(), 120);
    const t2 = window.setTimeout(() => AOS.refresh(), 500);
    recordVisit(location.pathname).catch(() => {
      // Les statistiques ne doivent jamais bloquer l’affichage du site.
    });
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [location.pathname]);

  // Suivi automatique des actions clés du visiteur (clics services, projets, contact, CV, réseaux...)
  useEffect(() => {
    function handleTrackedClick(event) {
      const target = event.target?.closest?.("a, button");
      if (!target) return;

      const label = (
        target.getAttribute("aria-label") ||
        target.textContent ||
        ""
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 100);
      const href = target.getAttribute("href") || "";

      if (href.startsWith("mailto:")) {
        recordVisitorEvent("click_email", href.replace("mailto:", "")).catch(
          () => {},
        );
      } else if (href.includes("wa.me") || href.includes("whatsapp")) {
        recordVisitorEvent("click_whatsapp", "WhatsApp").catch(() => {});
      } else if (href.endsWith(".pdf") || href === "/cv") {
        recordVisitorEvent("download_cv", label || "CV").catch(() => {});
      } else if (href.startsWith("/services/")) {
        recordVisitorEvent("click_service", label || href, { href }).catch(
          () => {},
        );
      } else if (
        target.closest(".hs-work, .project-card") &&
        target.tagName === "A"
      ) {
        recordVisitorEvent("click_project", label || href, { href }).catch(
          () => {},
        );
      } else if (target.closest(".social-links")) {
        recordVisitorEvent("click_social", label || href, { href }).catch(
          () => {},
        );
      } else if (href === "/contact" || target.classList.contains("neo-primary")) {
        recordVisitorEvent("click_cta", label || "Contact", { href }).catch(
          () => {},
        );
      } else if (
        target.closest(".testimonial-card") &&
        target.tagName === "BUTTON"
      ) {
        recordVisitorEvent("open_testimonial", label || "Preuve avis").catch(
          () => {},
        );
      }
    }

    document.addEventListener("click", handleTrackedClick, { passive: true });
    return () => document.removeEventListener("click", handleTrackedClick);
  }, []);

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
