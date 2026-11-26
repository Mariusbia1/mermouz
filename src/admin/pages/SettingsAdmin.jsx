import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { checkDatabaseHealth } from "../../lib/portfolioApi";

export default function SettingsAdmin() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("Marius BIAOU");
  const [accountOpen, setAccountOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(true);

  async function runHealthCheck() {
    setChecking(true);
    try {
      setHealth(await checkDatabaseHealth());
    } catch {
      setHealth({ tables: [], isAdmin: false, adminError: "Connexion impossible" });
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || "");
      setName(data.user?.user_metadata?.full_name || "Marius BIAOU");
    });
    runHealthCheck();
  }, []);

  async function changePassword(event) {
    event.preventDefault();
    setMessage("");
    setMessageError(false);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password.length < 8) {
      setMessageError(true);
      setMessage("Utilisez au moins 8 caractères.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessageError(true);
      setMessage(error.message || "Le mot de passe n’a pas pu être modifié.");
      return;
    }
    setMessage("Mot de passe modifié avec succès.");
    window.setTimeout(() => setPasswordOpen(false), 1200);
  }

  async function updateAccount(event) {
    event.preventDefault();
    setMessage("");
    setMessageError(false);
    const form = new FormData(event.currentTarget);
    const nextName = String(form.get("name") || "").trim();
    const nextEmail = String(form.get("email") || "").trim();
    const payload = { data: { full_name: nextName } };
    if (nextEmail && nextEmail !== email) {
      payload.email = nextEmail;
    }
    const { error } = await supabase.auth.updateUser(payload);
    if (error) {
      setMessageError(true);
      setMessage(
        error.message || "Les informations n’ont pas pu être modifiées.",
      );
      return;
    }
    setName(nextName);
    if (payload.email) {
      setEmail(nextEmail);
      setMessage(
        "Demande enregistrée. Confirmez le changement via le lien envoyé à votre nouvelle adresse email.",
      );
    } else {
      setMessage("Nom administrateur mis à jour.");
    }
  }

  const allTablesOk =
    health && health.tables.length > 0 && health.tables.every((t) => t.ok);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>PARAMÈTRES</span>
          <h1>Configuration</h1>
          <p>Gérez votre compte, la sécurité et l’état complet de Supabase.</p>
        </div>
      </header>
      <section className="admin-settings-grid">
        <article>
          <UserRound />
          <div>
            <h2>Compte administrateur</h2>
            <p>
              {name}
              <br />
              {email}
            </p>
          </div>
          <button
            onClick={() => {
              setMessage("");
              setMessageError(false);
              setAccountOpen(true);
            }}
          >
            Modifier
          </button>
        </article>
        <article>
          <LockKeyhole />
          <div>
            <h2>Sécurité du compte</h2>
            <p>Votre accès est protégé par Supabase Auth.</p>
          </div>
          <button
            onClick={() => {
              setMessage("");
              setMessageError(false);
              setPasswordOpen(true);
            }}
          >
            <KeyRound /> Modifier le mot de passe
          </button>
        </article>
        <article>
          <Database />
          <div>
            <h2>Base de données Supabase</h2>
            <p>
              {checking
                ? "Vérification des tables et des droits…"
                : allTablesOk && health?.isAdmin
                  ? "Toutes les tables et permissions admin sont actives."
                  : "Certaines tables ou permissions nécessitent le script SQL."}
            </p>
          </div>
          <button onClick={runHealthCheck} disabled={checking}>
            <RefreshCw /> {checking ? "Vérification…" : "Revérifier"}
          </button>
        </article>
      </section>

      {health && (
        <section className="admin-panel admin-health-panel">
          <div className="admin-panel-head">
            <div>
              <span>DIAGNOSTIC BASE DE DONNÉES</span>
              <h2>État des tables & permissions</h2>
            </div>
            <span
              className={`admin-health-badge ${health.isAdmin ? "ok" : "warn"}`}
            >
              {health.isAdmin ? <ShieldCheck /> : <AlertTriangle />}
              {health.isAdmin
                ? "Session reconnue comme admin"
                : "Droits admin RLS non reconnus"}
            </span>
          </div>
          {!health.isAdmin && (
            <p className="admin-data-message error">
              Votre compte connecté ({email}) n’est pas reconnu par{" "}
              <code>is_portfolio_admin()</code>. Exécutez le script{" "}
              <code>supabase/admin-and-analytics.sql</code> dans le SQL Editor
              de Supabase pour débloquer toutes les modifications (email,
              contenus, services mis en avant, projets et suivi visiteurs).
            </p>
          )}
          <div className="admin-health-grid">
            {health.tables.map((table) => (
              <div
                key={table.key}
                className={`admin-health-item ${table.ok ? "ok" : "warn"}`}
              >
                {table.ok ? <CheckCircle2 /> : <AlertTriangle />}
                <div>
                  <strong>{table.label}</strong>
                  <small>
                    {table.ok ? `Table ${table.key} OK` : table.error || "Manquante"}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {accountOpen && (
        <div className="admin-modal">
          <form onSubmit={updateAccount}>
            <div className="admin-modal-head">
              <div>
                <span>COMPTE</span>
                <h2>Informations administrateur</h2>
              </div>
              <button type="button" onClick={() => setAccountOpen(false)}>
                <X />
              </button>
            </div>
            <label>
              Nom complet
              <input name="name" defaultValue={name} required />
            </label>
            <label>
              Adresse email de connexion
              <input name="email" type="email" defaultValue={email} required />
              <small className="admin-field-help">
                Pour modifier l’email affiché publiquement sur le portfolio,
                utilisez aussi l’onglet Contenus → Profil.
              </small>
            </label>
            {message && (
              <p className={`admin-data-message ${messageError ? "error" : ""}`}>
                {message}
              </p>
            )}
            <button className="admin-form-submit">Enregistrer le compte</button>
          </form>
        </div>
      )}
      {passwordOpen && (
        <div className="admin-modal">
          <form onSubmit={changePassword}>
            <div className="admin-modal-head">
              <div>
                <span>SÉCURITÉ</span>
                <h2>Nouveau mot de passe</h2>
              </div>
              <button type="button" onClick={() => setPasswordOpen(false)}>
                <X />
              </button>
            </div>
            <label>
              Nouveau mot de passe
              <input name="password" type="password" minLength="8" required />
            </label>
            {message && (
              <p className={`admin-data-message ${messageError ? "error" : ""}`}>
                {message}
              </p>
            )}
            <button className="admin-form-submit">
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>
      )}
    </>
  );
}
