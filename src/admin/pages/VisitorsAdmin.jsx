import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Eye,
  FileDown,
  Globe,
  Mail,
  MessageCircle,
  MessageSquareText,
  Monitor,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Sparkles,
  Tablet,
  Users,
  Wrench,
} from "lucide-react";
import { getVisitorActivity } from "../../lib/portfolioApi";

const EVENT_META = {
  page_view: { label: "Page consultée", icon: Eye, tone: "blue" },
  click_service: { label: "Service cliqué", icon: Wrench, tone: "blue" },
  click_project: { label: "Projet ouvert", icon: BriefcaseBusiness, tone: "blue" },
  click_cta: { label: "Bouton contact", icon: MousePointerClick, tone: "green" },
  click_whatsapp: { label: "Clic WhatsApp", icon: MessageCircle, tone: "green" },
  click_email: { label: "Clic Email", icon: Mail, tone: "green" },
  click_social: { label: "Réseau social", icon: Globe, tone: "muted" },
  download_cv: { label: "CV consulté", icon: FileDown, tone: "blue" },
  open_testimonial: { label: "Preuve avis vue", icon: Sparkles, tone: "muted" },
  form_submit: { label: "Formulaire envoyé", icon: MessageSquareText, tone: "green" },
};

const PAGE_LABELS = {
  "/": "Accueil",
  "/about": "À propos",
  "/services": "Services",
  "/works": "Projets",
  "/cv": "CV",
  "/contact": "Contact",
  "/confidentialite": "Confidentialité",
};

function shortVisitor(id) {
  return `#${String(id || "000000").slice(0, 6).toUpperCase()}`;
}

function formatHost(referrer) {
  if (!referrer) return "Accès direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function DeviceIcon({ type }) {
  if (type === "Mobile") return <Smartphone />;
  if (type === "Tablette") return <Tablet />;
  return <Monitor />;
}

export default function VisitorsAdmin() {
  const [visits, setVisits] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventsTableMissing, setEventsTableMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [eventFilter, setEventFilter] = useState("all");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getVisitorActivity({ limit: 400 });
      setVisits(data.visits);
      setEvents(data.events);
      setEventsTableMissing(data.eventsTableMissing);
    } catch (requestError) {
      setError(
        requestError?.message || "Impossible de charger l’activité visiteurs.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Regroupe visites et actions par visiteur anonyme
  const visitors = useMemo(() => {
    const map = new Map();
    const ensure = (id) => {
      if (!map.has(id)) {
        map.set(id, {
          id,
          pages: new Set(),
          visitsCount: 0,
          actionsCount: 0,
          lastSeen: null,
          device: "Ordinateur",
          browser: "",
          referrer: null,
          timeline: [],
        });
      }
      return map.get(id);
    };

    visits.forEach((visit) => {
      const entry = ensure(visit.visitor_id);
      entry.visitsCount += 1;
      entry.pages.add(visit.page_path);
      if (visit.device_type) entry.device = visit.device_type;
      if (visit.browser) entry.browser = visit.browser;
      if (visit.referrer && !entry.referrer) entry.referrer = visit.referrer;
      if (!entry.lastSeen || new Date(visit.visited_at) > new Date(entry.lastSeen)) {
        entry.lastSeen = visit.visited_at;
      }
      if (eventsTableMissing) {
        entry.timeline.push({
          id: `v-${visit.id}`,
          type: "page_view",
          label: PAGE_LABELS[visit.page_path] || visit.page_path,
          page_path: visit.page_path,
          created_at: visit.visited_at,
        });
      }
    });

    events.forEach((ev) => {
      const entry = ensure(ev.visitor_id);
      if (ev.event_type !== "page_view") entry.actionsCount += 1;
      if (ev.metadata?.device_type) entry.device = ev.metadata.device_type;
      if (ev.metadata?.browser) entry.browser = ev.metadata.browser;
      if (ev.metadata?.referrer && !entry.referrer) {
        entry.referrer = ev.metadata.referrer;
      }
      if (!entry.lastSeen || new Date(ev.created_at) > new Date(entry.lastSeen)) {
        entry.lastSeen = ev.created_at;
      }
      entry.timeline.push({
        id: `e-${ev.id}`,
        type: ev.event_type,
        label:
          ev.event_type === "page_view"
            ? PAGE_LABELS[ev.page_path] || ev.page_path
            : ev.event_label || ev.page_path,
        page_path: ev.page_path,
        created_at: ev.created_at,
      });
    });

    return [...map.values()]
      .map((entry) => ({
        ...entry,
        timeline: entry.timeline.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        ),
      }))
      .sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0));
  }, [visits, events, eventsTableMissing]);

  const todayCount = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return visitors.filter(
      (visitor) => visitor.lastSeen && new Date(visitor.lastSeen) >= startOfDay,
    ).length;
  }, [visitors]);

  const totalActions = useMemo(
    () => events.filter((ev) => ev.event_type !== "page_view").length,
    [events],
  );

  const visibleTimeline = useMemo(() => {
    const base = selectedVisitor
      ? visitors.find((v) => v.id === selectedVisitor)?.timeline || []
      : visitors
          .flatMap((v) =>
            v.timeline.map((item) => ({ ...item, visitorId: v.id })),
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 100);

    if (eventFilter === "all") return base;
    if (eventFilter === "actions") {
      return base.filter((item) => item.type !== "page_view");
    }
    return base.filter((item) => item.type === eventFilter);
  }, [visitors, selectedVisitor, eventFilter]);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>ANALYTIQUE & SUIVI</span>
          <h1>Visiteurs et actions</h1>
          <p>
            Suivez les personnes qui visitent votre portfolio et les actions
            qu’elles réalisent en temps réel.
          </p>
        </div>
        <button type="button" onClick={load} disabled={loading}>
          <RefreshCw /> {loading ? "Actualisation..." : "Actualiser"}
        </button>
      </header>

      {error && <p className="admin-data-message error">{error}</p>}
      {eventsTableMissing && (
        <p className="admin-data-message error">
          La table <code>visitor_events</code> n’est pas encore créée dans
          Supabase. Exécutez le script{" "}
          <code>supabase/admin-and-analytics.sql</code> dans le SQL Editor de
          Supabase pour activer le suivi détaillé des clics et actions.
        </p>
      )}

      <section className="admin-stat-grid">
        <article>
          <div>
            <Users />
            <span>Visiteurs uniques</span>
          </div>
          <strong>{visitors.length}</strong>
          <small>{todayCount} actif{todayCount > 1 ? "s" : ""} aujourd’hui</small>
        </article>
        <article>
          <div>
            <Eye />
            <span>Pages consultées</span>
          </div>
          <strong>{visits.length}</strong>
          <small>Sur les 400 dernières visites</small>
        </article>
        <article>
          <div>
            <MousePointerClick />
            <span>Actions enregistrées</span>
          </div>
          <strong>{totalActions}</strong>
          <small>Clics services, projets, contact, CV…</small>
        </article>
        <article>
          <div>
            <Activity />
            <span>Engagement moyen</span>
          </div>
          <strong>
            {visitors.length
              ? (visits.length / visitors.length).toFixed(1).replace(".", ",")
              : "0"}
          </strong>
          <small>Pages consultées par visiteur</small>
        </article>
      </section>

      <section className="admin-visitors-layout">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span>VISITEURS RÉCENTS</span>
              <h2>Parcours individuels</h2>
            </div>
            {selectedVisitor && (
              <button
                type="button"
                className="admin-inline-reset"
                onClick={() => setSelectedVisitor(null)}
              >
                Tout voir
              </button>
            )}
          </div>

          <div className="admin-visitor-list">
            {visitors.length ? (
              visitors.map((visitor) => {
                const active = selectedVisitor === visitor.id;
                return (
                  <button
                    type="button"
                    key={visitor.id}
                    className={`admin-visitor-row ${active ? "active" : ""}`}
                    onClick={() =>
                      setSelectedVisitor(active ? null : visitor.id)
                    }
                  >
                    <span className="admin-visitor-device">
                      <DeviceIcon type={visitor.device} />
                    </span>
                    <div className="admin-visitor-meta">
                      <strong>
                        Visiteur {shortVisitor(visitor.id)}
                        <small>
                          {visitor.device}
                          {visitor.browser ? ` · ${visitor.browser}` : ""}
                        </small>
                      </strong>
                      <span>
                        {visitor.pages.size} page
                        {visitor.pages.size > 1 ? "s" : ""} ·{" "}
                        {visitor.actionsCount} action
                        {visitor.actionsCount > 1 ? "s" : ""} ·{" "}
                        {formatHost(visitor.referrer)}
                      </span>
                    </div>
                    <time>{formatDateTime(visitor.lastSeen)}</time>
                  </button>
                );
              })
            ) : (
              <p className="admin-empty-text">
                Aucune visite enregistrée pour le moment.
              </p>
            )}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span>CHRONOLOGIE</span>
              <h2>
                {selectedVisitor
                  ? `Actions du visiteur ${shortVisitor(selectedVisitor)}`
                  : "Dernières actions sur le site"}
              </h2>
            </div>
          </div>

          <div className="admin-event-filters">
            {[
              ["all", "Tout"],
              ["actions", "Actions seules"],
              ["page_view", "Pages"],
              ["click_service", "Services"],
              ["click_project", "Projets"],
              ["click_cta", "Contact"],
              ["click_whatsapp", "WhatsApp"],
              ["download_cv", "CV"],
              ["form_submit", "Formulaires"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={eventFilter === value ? "active" : ""}
                onClick={() => setEventFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="admin-timeline">
            {visibleTimeline.length ? (
              visibleTimeline.map((item) => {
                const meta = EVENT_META[item.type] || {
                  label: item.type,
                  icon: Activity,
                  tone: "muted",
                };
                const Icon = meta.icon;
                return (
                  <div className="admin-timeline-item" key={item.id}>
                    <span className={`admin-timeline-icon tone-${meta.tone}`}>
                      <Icon />
                    </span>
                    <div className="admin-timeline-body">
                      <strong>
                        {meta.label}
                        {!selectedVisitor && item.visitorId && (
                          <small>{shortVisitor(item.visitorId)}</small>
                        )}
                      </strong>
                      <span>
                        {item.label}
                        {item.type !== "page_view" && item.page_path
                          ? ` · sur ${PAGE_LABELS[item.page_path] || item.page_path}`
                          : ""}
                      </span>
                    </div>
                    <time>{formatDateTime(item.created_at)}</time>
                  </div>
                );
              })
            ) : (
              <p className="admin-empty-text">
                Aucune action correspondante pour ce filtre.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
