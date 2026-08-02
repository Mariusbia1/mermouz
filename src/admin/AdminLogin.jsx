import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!email || password.length < 6) {
      setError(
        "Renseignez une adresse email et un mot de passe d’au moins 6 caractères.",
      );
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (authError) {
      setError("Identifiants incorrects ou compte administrateur inexistant.");
      return;
    }
    navigate(location.state?.from?.pathname || "/admin", { replace: true });
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-grid" />
      <section className="admin-login-intro">
        <a href="/" className="admin-login-brand">
          Marius BIAOU<em>.</em>
        </a>
        <div>
          <span>ESPACE PRIVÉ</span>
          <h1>Gérez votre portfolio depuis un seul endroit.</h1>
          <p>Projets, services, demandes et contenus seront centralisés ici.</p>
        </div>
      </section>
      <section className="admin-login-panel">
        <form onSubmit={submit}>
          <span>CONNEXION ADMINISTRATEUR</span>
          <h2>Bon retour, Marius.</h2>
          <p>Connectez-vous avec votre compte administrateur sécurisé.</p>
          <label>
            Adresse email
            <div>
              <Mail />
              <input
                name="email"
                type="email"
                placeholder="marius@exemple.com"
              />
            </div>
          </label>
          <label>
            Mot de passe
            <div>
              <LockKeyhole />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          {error && <div className="admin-login-error">{error}</div>}
          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion en cours" : "Accéder au dashboard"}{" "}
            <ArrowRight />
          </button>
        </form>
      </section>
    </main>
  );
}
