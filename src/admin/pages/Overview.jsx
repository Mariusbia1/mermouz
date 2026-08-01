import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Eye,
  MessageSquareText,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getContactRequests,
  getProjects,
  getServices,
  getVisitorStats,
} from "../../lib/portfolioApi";

export default function Overview() {
  const [visitorStats, setVisitorStats] = useState({
    visitors: 0,
    visits: 0,
    source: "loading",
  });
  const [requests, setRequests] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    Promise.all([
      getVisitorStats(),
      getContactRequests(),
      getProjects(),
      getServices(),
    ])
      .then(([stats, contacts, projects, services]) => {
        setVisitorStats(stats);
        setRequests(contacts.slice(0, 3));
        setProjectCount(
          projects.filter((item) => item.status === "published").length,
        );
        setServiceCount(services.filter((item) => item.is_active).length);
      })
      .catch(() =>
        setVisitorStats((current) => ({ ...current, source: "error" })),
      );
  }, []);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>VUE D’ENSEMBLE</span>
          <h1>Bonjour Marius.</h1>
          <p>Voici un aperçu de l’activité de votre portfolio.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer">
          Voir le site <ArrowUpRight />
        </a>
      </header>
      <section className="admin-stat-grid">
        <article>
          <div>
            <Eye />
            <span>Visiteurs enregistrés</span>
          </div>
          <strong>{visitorStats.visitors.toLocaleString("fr-FR")}</strong>
          <small>
            {visitorStats.source === "supabase"
              ? `${visitorStats.visits.toLocaleString("fr-FR")} pages consultées`
              : "Compteur local, prêt pour Supabase"}
          </small>
        </article>
        <article>
          <div>
            <MessageSquareText />
            <span>Nouvelles demandes</span>
          </div>
          <strong>
            {requests.filter((item) => item.status === "nouveau").length}
          </strong>
          <small>Demandes qui attendent votre réponse</small>
        </article>
        <article>
          <div>
            <BriefcaseBusiness />
            <span>Projets publiés</span>
          </div>
          <strong>{projectCount}</strong>
          <small>Présents sur le portfolio</small>
        </article>
        <article>
          <div>
            <Wrench />
            <span>Services actifs</span>
          </div>
          <strong>{serviceCount}</strong>
          <small>Visibles actuellement</small>
        </article>
      </section>
      <section className="admin-dashboard-grid">
        <div className="admin-panel admin-recent">
          <div className="admin-panel-head">
            <div>
              <span>DEMANDES RÉCENTES</span>
              <h2>Derniers contacts reçus</h2>
            </div>
            <Link to="/admin/requests">Tout afficher</Link>
          </div>
          <div className="admin-table">
            {requests.map((item) => (
              <div className="admin-table-row" key={item.id}>
                <div className="admin-avatar">{item.name.charAt(0)}</div>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.service_slug || "Demande générale"}</span>
                </div>
                <small>
                  {new Date(item.created_at).toLocaleDateString("fr-FR")}
                </small>
                <i className={`status-${item.status}`}>
                  {item.status === "nouveau" ? "Nouveau" : item.status}
                </i>
              </div>
            ))}
          </div>
        </div>
        <aside className="admin-panel admin-quick">
          <div className="admin-panel-head">
            <div>
              <span>ACTIONS RAPIDES</span>
              <h2>Que voulez-vous faire ?</h2>
            </div>
          </div>
          <Link to="/admin/projects">
            Ajouter un projet <ArrowUpRight />
          </Link>
          <Link to="/admin/services">
            Gérer les services <ArrowUpRight />
          </Link>
          <Link to="/admin/content">
            Modifier les contenus <ArrowUpRight />
          </Link>
        </aside>
      </section>
    </>
  );
}
