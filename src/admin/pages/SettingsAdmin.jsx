import React, { useEffect, useState } from "react";
import {
  Database,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function SettingsAdmin() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("BIAOU Marius");
  const [accountOpen, setAccountOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [database, setDatabase] = useState("Vérification");

  async function checkDatabase() {
    setDatabase("Vérification");
    const { error } = await supabase.from("services").select("id").limit(1);
    setDatabase(error ? "Erreur de connexion" : "Connectée");
  }
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || "");
      setName(data.user?.user_metadata?.full_name || "BIAOU Marius");
    });
    checkDatabase();
  }, []);

  async function changePassword(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password.length < 8) {
      setMessage("Utilisez au moins 8 caractères.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("Le mot de passe n’a pas pu être modifié.");
      return;
    }
    setMessage("Mot de passe modifié avec succès.");
    window.setTimeout(() => setPasswordOpen(false), 1200);
  }

  async function updateAccount(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextName = String(form.get("name"));
    const nextEmail = String(form.get("email"));
    const { error } = await supabase.auth.updateUser({
      email: nextEmail,
      data: { full_name: nextName },
    });
    if (error) {
      setMessage("Les informations n’ont pas pu être modifiées.");
      return;
    }
    setName(nextName);
    setEmail(nextEmail);
    setMessage(
      "Compte mis à jour. Un email de confirmation peut être demandé.",
    );
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>PARAMÈTRES</span>
          <h1>Configuration</h1>
          <p>Gérez votre compte, la sécurité et la connexion Supabase.</p>
        </div>
      </header>
      <section className="admin-settings-grid">
        <article>
          <UserRound />
          <div>
            <h2>Profil public</h2>
            <p>
              {name}
              <br />
              {email}
            </p>
          </div>
          <button
            onClick={() => {
              setMessage("");
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
              Projets, services, demandes, visiteurs et contenus sont
              synchronisés.
            </p>
          </div>
          <button onClick={checkDatabase}>
            <RefreshCw /> {database}
          </button>
        </article>
      </section>
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
              Adresse email
              <input name="email" type="email" defaultValue={email} required />
            </label>
            {message && <p className="admin-data-message">{message}</p>}
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
            {message && <p className="admin-data-message">{message}</p>}
            <button className="admin-form-submit">
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>
      )}
    </>
  );
}
