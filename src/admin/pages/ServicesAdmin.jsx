import React, { useEffect, useState } from "react";
import {
  Edit3,
  Eye,
  EyeOff,
  Home,
  Plus,
  Star,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import {
  deleteService,
  getServices,
  getSiteContent,
  saveService,
  saveSiteContent,
} from "../../lib/portfolioApi";
import { MAX_FEATURED_SERVICES } from "../../hooks/usePortfolioData";

const emptyService = {
  title: "",
  short_description: "",
  description: "",
  benefits: [],
  inclusions: [],
  is_active: true,
};
const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [featured, setFeatured] = useState([]);
  const [savingFeatured, setSavingFeatured] = useState(false);
  async function load() {
    try {
      const [items, content] = await Promise.all([
        getServices(),
        getSiteContent(),
      ]);
      setServices(items);
      setFeatured(content.home?.featuredServices || []);
    } catch {
      setError("Impossible de charger les services.");
    }
  }
  useEffect(() => {
    load();
  }, []);

  // Choix des services mis en avant sur la page d'accueil (max 3, ordre de sélection).
  async function toggleFeatured(service) {
    if (savingFeatured) return;
    const isFeatured = featured.includes(service.slug);
    if (!isFeatured && featured.length >= MAX_FEATURED_SERVICES) {
      setError(
        `Vous pouvez mettre en avant ${MAX_FEATURED_SERVICES} services maximum. Retirez-en un avant d’en ajouter un autre.`,
      );
      return;
    }
    if (!isFeatured && !service.is_active) {
      setError("Activez d’abord ce service pour pouvoir l’afficher sur l’accueil.");
      return;
    }
    const next = isFeatured
      ? featured.filter((slug) => slug !== service.slug)
      : [...featured, service.slug];
    setSavingFeatured(true);
    setError("");
    try {
      const content = await getSiteContent();
      await saveSiteContent({
        ...content,
        home: { ...content.home, featuredServices: next },
      });
      setFeatured(next);
    } catch (requestError) {
      setError(
        requestError?.message || "Impossible de mettre à jour l’accueil.",
      );
    } finally {
      setSavingFeatured(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title"));
    try {
      await saveService({
        id: editing?.id,
        title,
        slug: editing?.slug || slugify(title),
        short_description: String(form.get("short_description")),
        description: String(form.get("description")),
        benefits: String(form.get("benefits") || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        inclusions: String(form.get("inclusions") || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        is_active: form.get("is_active") === "true",
        display_order: editing?.display_order ?? services.length + 1,
      });
      setEditing(null);
      await load();
    } catch (requestError) {
      setError(
        requestError?.message || "L’enregistrement du service a échoué.",
      );
    }
  }
  async function toggle(service) {
    try {
      const nextActive = !service.is_active;
      await saveService({ ...service, is_active: nextActive });
      if (!nextActive && featured.includes(service.slug)) {
        const content = await getSiteContent();
        const nextFeatured = featured.filter((slug) => slug !== service.slug);
        await saveSiteContent({
          ...content,
          home: { ...content.home, featuredServices: nextFeatured },
        });
      }
      await load();
    } catch {
      setError("La modification a échoué.");
    }
  }
  async function remove(service) {
    if (!window.confirm("Supprimer définitivement ce service ?")) return;
    try {
      await deleteService(service.id);
      if (featured.includes(service.slug)) {
        const content = await getSiteContent();
        const nextFeatured = featured.filter((slug) => slug !== service.slug);
        await saveSiteContent({
          ...content,
          home: { ...content.home, featuredServices: nextFeatured },
        });
      }
      await load();
    } catch {
      setError("La suppression a échoué.");
    }
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>GESTION DES SERVICES</span>
          <h1>Vos offres</h1>
          <p>Ajoutez et contrôlez les services visibles sur le portfolio.</p>
        </div>
        <button onClick={() => setEditing(emptyService)}>
          <Plus /> Nouveau service
        </button>
      </header>
      {error && <p className="admin-data-message error">{error}</p>}
      <div className="admin-featured-info">
        <Home />
        <p>
          <strong>
            Accueil : {featured.length}/{MAX_FEATURED_SERVICES} services mis en
            avant.
          </strong>{" "}
          Cliquez sur « Mettre en avant » pour choisir les services affichés
          sur la page d’accueil (dans l’ordre de sélection). Sans sélection,
          les {MAX_FEATURED_SERVICES} premiers services actifs sont affichés.
        </p>
      </div>
      <section className="admin-service-grid">
        {services.map((service) => {
          const rank = featured.indexOf(service.slug);
          return (
          <article
            className={service.is_active ? "" : "disabled"}
            key={service.id}
          >
            <div className="admin-service-icon">
              <Wrench />
            </div>
            <div>
              <span>
                {service.is_active ? "ACTIF" : "MASQUÉ"}
                {rank >= 0 && ` · ACCUEIL #${rank + 1}`}
              </span>
              <h2>{service.title}</h2>
              <p>{service.short_description}</p>
            </div>
            <footer>
              <button
                className={rank >= 0 ? "admin-featured-active" : ""}
                onClick={() => toggleFeatured(service)}
                disabled={savingFeatured}
                aria-pressed={rank >= 0}
              >
                <Star />
                {rank >= 0 ? "Retirer de l’accueil" : "Mettre en avant"}
              </button>
              <button onClick={() => setEditing(service)}>
                <Edit3 /> Modifier
              </button>
              <button onClick={() => toggle(service)}>
                {service.is_active ? <EyeOff /> : <Eye />}
                {service.is_active ? "Masquer" : "Afficher"}
              </button>
              <button
                className="admin-delete-action"
                onClick={() => remove(service)}
              >
                <Trash2 /> Supprimer
              </button>
            </footer>
          </article>
          );
        })}
      </section>
      {editing && (
        <div className="admin-modal">
          <form onSubmit={submit}>
            <div className="admin-modal-head">
              <div>
                <span>SERVICE</span>
                <h2>{editing.id ? "Modifier l’offre" : "Ajouter une offre"}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </div>
            <label>
              Nom du service
              <input name="title" required defaultValue={editing.title} />
            </label>
            <label>
              Résumé
              <textarea
                name="short_description"
                required
                defaultValue={editing.short_description}
              />
            </label>
            <label>
              Description détaillée
              <textarea
                name="description"
                required
                defaultValue={editing.description}
              />
            </label>
            <label>
              Avantages pour le client
              <textarea
                name="benefits"
                required
                defaultValue={(editing.benefits || []).join("\n")}
                placeholder={"Un avantage par ligne\nExemple : Gagner du temps"}
              />
            </label>
            <label>
              Ce qui est inclus
              <textarea
                name="inclusions"
                required
                defaultValue={(editing.inclusions || []).join("\n")}
                placeholder={
                  "Un élément par ligne\nExemple : Design adapté au mobile"
                }
              />
            </label>
            <label>
              Visibilité
              <select name="is_active" defaultValue={String(editing.is_active)}>
                <option value="true">Actif</option>
                <option value="false">Masqué</option>
              </select>
            </label>
            <button className="admin-form-submit">
              Enregistrer le service
            </button>
          </form>
        </div>
      )}
    </>
  );
}
