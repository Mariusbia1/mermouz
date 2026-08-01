import React, { useEffect, useState } from "react";
import { Edit3, Eye, EyeOff, Plus, Trash2, Wrench, X } from "lucide-react";
import {
  deleteService,
  getServices,
  saveService,
} from "../../lib/portfolioApi";

const emptyService = {
  title: "",
  short_description: "",
  description: "",
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
  async function load() {
    try {
      setServices(await getServices());
    } catch {
      setError("Impossible de charger les services.");
    }
  }
  useEffect(() => {
    load();
  }, []);

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
        benefits: editing?.benefits || [],
        inclusions: editing?.inclusions || [],
        is_active: form.get("is_active") === "true",
        display_order: editing?.display_order ?? services.length + 1,
      });
      setEditing(null);
      await load();
    } catch {
      setError("L’enregistrement du service a échoué.");
    }
  }
  async function toggle(service) {
    try {
      await saveService({ ...service, is_active: !service.is_active });
      await load();
    } catch {
      setError("La modification a échoué.");
    }
  }
  async function remove(id) {
    if (!window.confirm("Supprimer définitivement ce service ?")) return;
    try {
      await deleteService(id);
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
      <section className="admin-service-grid">
        {services.map((service) => (
          <article
            className={service.is_active ? "" : "disabled"}
            key={service.id}
          >
            <div className="admin-service-icon">
              <Wrench />
            </div>
            <div>
              <span>{service.is_active ? "ACTIF" : "MASQUÉ"}</span>
              <h2>{service.title}</h2>
              <p>{service.short_description}</p>
            </div>
            <footer>
              <button onClick={() => setEditing(service)}>
                <Edit3 /> Modifier
              </button>
              <button onClick={() => toggle(service)}>
                {service.is_active ? <EyeOff /> : <Eye />}
                {service.is_active ? "Masquer" : "Afficher"}
              </button>
              <button
                className="admin-delete-action"
                onClick={() => remove(service.id)}
              >
                <Trash2 /> Supprimer
              </button>
            </footer>
          </article>
        ))}
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
