import React, { useEffect, useMemo, useState } from "react";
import { Check, Mail, MessageCircle, Search } from "lucide-react";
import {
  getContactRequests,
  updateContactStatus,
} from "../../lib/portfolioApi";
import { portfolioServices } from "../../data/services";

const labels = {
  nouveau: "Nouveau",
  en_cours: "À traiter",
  repondu: "Répondu",
  archive: "Archivé",
};

export default function RequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getContactRequests()
      .then((data) => {
        setRequests(data);
        setSelected(data[0] || null);
      })
      .catch(() => setError("Impossible de charger les demandes."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      filter === "Toutes"
        ? requests
        : requests.filter((item) => labels[item.status] === filter),
    [filter, requests],
  );

  async function markReplied(id) {
    await updateContactStatus(id, "repondu");
    const next = requests.map((item) =>
      item.id === id ? { ...item, status: "repondu" } : item,
    );
    setRequests(next);
    setSelected(next.find((item) => item.id === id));
  }

  function serviceName(slug) {
    return (
      portfolioServices.find((service) => service.slug === slug)?.title ||
      "Demande générale"
    );
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>DEMANDES DE DEVIS</span>
          <h1>Messages reçus</h1>
          <p>Consultez et traitez les demandes envoyées depuis le portfolio.</p>
        </div>
      </header>
      <div className="admin-request-filters">
        {["Toutes", "Nouveau", "À traiter", "Répondu"].map((item) => (
          <button
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      {error && <p className="admin-data-message error">{error}</p>}
      <section className="admin-inbox">
        <div className="admin-inbox-list">
          <div className="admin-inbox-search">
            <Search />
            <span>
              {loading
                ? "Chargement"
                : `${filtered.length} demande${filtered.length > 1 ? "s" : ""}`}
            </span>
          </div>
          {filtered.map((item) => (
            <button
              className={selected?.id === item.id ? "selected" : ""}
              onClick={() => setSelected(item)}
              key={item.id}
            >
              <span className={`request-dot ${item.status}`} />
              <div>
                <strong>{item.name}</strong>
                <span>{serviceName(item.service_slug)}</span>
                <small>{item.message}</small>
              </div>
            </button>
          ))}
        </div>
        {selected ? (
          <article className="admin-message-detail">
            <header>
              <div>
                <span>{labels[selected.status]}</span>
                <h2>{selected.name}</h2>
                <p>{serviceName(selected.service_slug)}</p>
              </div>
              {selected.status !== "repondu" && (
                <button onClick={() => markReplied(selected.id)}>
                  <Check /> Marquer comme répondu
                </button>
              )}
            </header>
            <div className="admin-contact-lines">
              <a href={`mailto:${selected.email}`}>
                <Mail />
                {selected.email}
              </a>
              <a
                href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle />
                {selected.whatsapp}
              </a>
            </div>
            <div className="admin-message-body">
              <span>MESSAGE</span>
              <p>{selected.message}</p>
            </div>
            <a
              className="admin-reply"
              href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Répondre sur WhatsApp
            </a>
          </article>
        ) : (
          <div className="admin-empty-state">
            Aucune demande reçue pour le moment.
          </div>
        )}
      </section>
    </>
  );
}
