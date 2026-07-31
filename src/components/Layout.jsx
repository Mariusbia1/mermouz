import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { FaFacebookF, FaGithub, FaWhatsapp } from "react-icons/fa6";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 850);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <div
        className={`site-loader ${loading ? "is-visible" : ""}`}
        aria-hidden={!loading}
      >
        <div className="loader-mark">
          <span className="loader-ring" />
          <span className="loader-ring loader-ring-inner" />
          <strong>
            mermouz<em>.</em>
          </strong>
        </div>
        <small>Création d’expériences digitales</small>
      </div>
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
            mermouz<em>.</em>
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
          </nav>
          <Link className="nav-contact" to="/contact">
            Me contacter <ArrowUpRight size={15} />
          </Link>
          <button className="mobile-menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-inner">
          <Link className="brand" to="/">
            mermouz<em>.</em>
          </Link>
          <span>BIAOU Marius · Abomey-Calavi, Bénin</span>
          <div className="social-links">
            <a href="#" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
          <small>© 2026. Tous droits réservés</small>
        </div>
      </footer>
    </>
  );
}
