import React, { useEffect, useMemo, useState } from "react";
import { Check, Download, Mail, MessageCircle, Search } from "lucide-react";
import {
  getContactRequests,
  updateContactStatus,
} from "../../lib/portfolioApi";
import { portfolioServices } from "../../data/services";
import { supabase } from "../../lib/supabase";

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

  useEffect(() => {
    const channel = supabase
      .channel("admin-requests-page")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_requests" },
        () => {
          getContactRequests().then((data) => {
            setRequests(data);
            setSelected((current) =>
              current
                ? data.find((item) => item.id === current.id) || data[0] || null
                : data[0] || null,
            );
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  function exportRequests() {
    const columns = [
      "Date",
      "Nom",
      "Email",
      "WhatsApp",
      "Service",
      "Statut",
      "Message",
    ];
    const escapeCell = (value) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = requests.map((item) => [
      new Date(item.created_at).toLocaleString("fr-FR"),
      item.name,
      item.email,
      item.whatsapp,
      serviceName(item.service_slug),
      labels[item.status] || item.status,
      item.message,
    ]);
    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCell).join(";"))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `demandes-portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>DEMANDES DE DEVIS</span>
          <h1>Messages reçus</h1>
          <p>Consultez et traitez les demandes envoyées depuis le portfolio.</p>
        </div>
        <button
          className="admin-export-button"
          type="button"
          onClick={exportRequests}
          disabled={!requests.length}
        >
          <Download /> Exporter en CSV
        </button>
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
