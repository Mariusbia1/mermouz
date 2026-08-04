import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, MessageSquareText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getContactRequests,
  updateContactStatus,
} from "../lib/portfolioApi";
import { supabase } from "../lib/supabase";

function formatDate(value) {
  const date = new Date(value);
  const elapsed = Date.now() - date.getTime();
  const minutes = Math.floor(elapsed / 60000);

  if (minutes < 1) return "À l’instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (minutes < 1440) return `Il y a ${Math.floor(minutes / 60)} h`;

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  async function loadRequests({ silent = false } = {}) {
    if (!silent) setLoading(true);
    try {
      const data = await getContactRequests();
      setRequests(data.slice(0, 12));
    } catch {
      // La barre d’administration reste utilisable si le réseau est indisponible.
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();

    const refreshInterval = window.setInterval(
      () => loadRequests({ silent: true }),
      30000,
    );
    const channel = supabase
      .channel("admin-contact-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_requests" },
        () => loadRequests({ silent: true }),
      )
      .subscribe();

    return () => {
      window.clearInterval(refreshInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  const unreadCount = useMemo(
    () => requests.filter((item) => item.status === "nouveau").length,
    [requests],
  );

  async function openRequest(request) {
    if (request.status === "nouveau") {
      await updateContactStatus(request.id, "en_cours");
      setRequests((items) =>
        items.map((item) =>
          item.id === request.id ? { ...item, status: "en_cours" } : item,
        ),
      );
    }
    setOpen(false);
    navigate("/admin/requests");
  }

  async function markAllAsRead() {
    const unread = requests.filter((item) => item.status === "nouveau");
    await Promise.all(
      unread.map((item) => updateContactStatus(item.id, "en_cours")),
    );
    setRequests((items) =>
      items.map((item) =>
        item.status === "nouveau" ? { ...item, status: "en_cours" } : item,
      ),
    );
  }

  return (
    <div className="admin-notifications" ref={panelRef}>
      <button
        className="admin-notification-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : ""}`}
        aria-expanded={open}
      >
        <Bell />
        {unreadCount > 0 && (
          <span>{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <section className="admin-notification-panel">
          <header>
            <div>
              <span>NOTIFICATIONS</span>
              <strong>Nouvelles demandes</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)}>
              <X />
            </button>
          </header>

          {unreadCount > 0 && (
            <button
              className="admin-notifications-read-all"
              type="button"
              onClick={markAllAsRead}
            >
              <CheckCheck /> Tout marquer comme lu
            </button>
          )}

          <div className="admin-notification-list">
            {loading ? (
              <p>Chargement des notifications...</p>
            ) : requests.length ? (
              requests.map((request) => (
                <button
                  className={request.status === "nouveau" ? "unread" : ""}
                  type="button"
                  onClick={() => openRequest(request)}
                  key={request.id}
                >
                  <i>
                    <MessageSquareText />
                  </i>
                  <span>
                    <strong>{request.name}</strong>
                    <small>{request.message}</small>
                    <time>{formatDate(request.created_at)}</time>
                  </span>
                </button>
              ))
            ) : (
              <div className="admin-notification-empty">
                <Bell />
                <p>Aucune notification pour le moment.</p>
              </div>
            )}
          </div>

          <button
            className="admin-notifications-footer"
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("/admin/requests");
            }}
          >
            Voir toutes les demandes
          </button>
        </section>
      )}
    </div>
  );
}
