import React, { useEffect, useState } from "react";
import { Edit3, Plus, Search, Trash2, X } from "lucide-react";
import {
  deleteProject,
  getProjects,
  saveProject,
  uploadProjectScreenshot,
} from "../../lib/portfolioApi";

const emptyProject = {
  title: "",
  category: "",
  summary: "",
  image_url: "",
  project_url: "",
  status: "published",
};
const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");

  async function load() {
    try {
      setProjects(await getProjects());
    } catch {
      setError("Impossible de charger les projets.");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError("");
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    try {
      if (title.length < 3) {
        throw new Error("Le titre doit contenir au moins 3 caractères.");
      }
      if (summary.length < 20) {
        throw new Error("Ajoutez une description d’au moins 20 caractères.");
      }
      const screenshot = form.get("screenshot");
      let imageUrl = editing?.image_url || null;
      if (screenshot instanceof File && screenshot.size > 0) {
        imageUrl = await uploadProjectScreenshot(screenshot);
      }
      await saveProject({
        id: editing?.id,
        title,
        slug: editing?.slug || `${slugify(title)}-${Date.now()}`,
        category: String(form.get("category")),
        summary,
        image_url: imageUrl,
        project_url: String(form.get("project_url")) || null,
        status: String(form.get("status")),
      });
      setEditing(null);
      setPreview("");
      setError("");
      await load();
    } catch (requestError) {
      const message =
        requestError?.message || "L’enregistrement du projet a échoué.";
      setFormError(
        message.includes("row-level security")
          ? "Votre session n’autorise pas cet enregistrement. Reconnectez-vous au dashboard puis réessayez."
          : message.includes("Bucket not found")
            ? "Le stockage portfolio-media est introuvable. Exécutez le script storage-fix.sql dans Supabase."
            : message,
      );
    } finally {
      setSaving(false);
    }
  }

  function openForm(project) {
    setFormError("");
    setPreview(project.image_url || "");
    setEditing(project);
  }

  function selectScreenshot(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Le fichier sélectionné doit être une image.");
      event.target.value = "";
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setFormError("La capture ne doit pas dépasser 15 Mo.");
      event.target.value = "";
      return;
    }
    setFormError("");
    setPreview(URL.createObjectURL(file));
  }

  async function remove(id) {
    if (!window.confirm("Supprimer définitivement ce projet ?")) return;
    try {
      await deleteProject(id);
      await load();
    } catch {
      setError("La suppression a échoué.");
    }
  }

  const visible = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>GESTION DES PROJETS</span>
          <h1>Vos réalisations</h1>
          <p>Les modifications sont directement publiées depuis Supabase.</p>
        </div>
        <button onClick={() => openForm(emptyProject)}>
          <Plus /> Nouveau projet
        </button>
      </header>
      {error && <p className="admin-data-message error">{error}</p>}
      <div className="admin-toolbar">
        <div>
          <Search />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un projet"
          />
        </div>
        <span>
          {visible.length} projet{visible.length > 1 ? "s" : ""}
        </span>
      </div>
      <section className="admin-project-list">
        {visible.map((project) => (
          <article key={project.id}>
            <div className="admin-project-thumb">
              {project.image_url ? (
                <img src={project.image_url} alt="" />
              ) : (
                <span>{project.title.charAt(0)}</span>
              )}
            </div>
            <div className="admin-project-info">
              <span>{project.category}</span>
              <h2>{project.title}</h2>
              <i
                className={
                  project.status === "published" ? "published" : "draft"
                }
              >
                {project.status === "published" ? "Publié" : "Brouillon"}
              </i>
            </div>
            <div className="admin-row-actions">
              <button title="Modifier" onClick={() => openForm(project)}>
                <Edit3 />
              </button>
              <button title="Supprimer" onClick={() => remove(project.id)}>
                <Trash2 />
              </button>
            </div>
          </article>
        ))}
      </section>
      {editing && (
        <div className="admin-modal">
          <form onSubmit={submit}>
            <div className="admin-modal-head">
              <div>
                <span>PROJET</span>
                <h2>
                  {editing.id
                    ? "Modifier la réalisation"
                    : "Ajouter une réalisation"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setPreview("");
                }}
              >
                <X />
              </button>
            </div>
            <label>
              Titre
              <input name="title" required defaultValue={editing.title} />
            </label>
            <label>
              Catégorie
              <select
                name="category"
                required
                defaultValue={editing.category || "Site vitrine"}
              >
                <option>Site vitrine</option>
                <option>Boutique en ligne</option>
                <option>Application web</option>
                <option>Application mobile</option>
                <option>Plateforme SaaS</option>
                <option>Outil métier</option>
                <option>Tunnel de vente</option>
              </select>
            </label>
            <label>
              Description
              <textarea
                name="summary"
                required
                defaultValue={editing.summary}
              />
            </label>
            <label>
              Capture du projet
              <input
                name="screenshot"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={selectScreenshot}
              />
              <small className="admin-field-help">
                Une seule capture suffit pour générer les aperçus ordinateur,
                tablette et mobile.
              </small>
            </label>
            {preview && (
              <img
                className="admin-project-image-preview"
                src={preview}
                alt="Aperçu de la capture"
              />
            )}
            <label>
              Lien du projet
              <input
                name="project_url"
                type="url"
                defaultValue={editing.project_url || ""}
              />
            </label>
            <label>
              Statut
              <select name="status" defaultValue={editing.status}>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
            </label>
            {formError && (
              <p className="admin-form-error" role="alert">
                {formError}
              </p>
            )}
            <button className="admin-form-submit" disabled={saving}>
              {saving ? "Enregistrement en cours" : "Enregistrer le projet"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
