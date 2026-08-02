import React, { useEffect, useState } from "react";
import {
  Edit3,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteTestimonial,
  getTestimonials,
  saveTestimonial,
  uploadTestimonialScreenshot,
} from "../../lib/portfolioApi";

const emptyTestimonial = {
  client_name: "",
  source: "ComeUp",
  service: "",
  quote: "",
  rating: 5,
  review_date: "",
  screenshot_url: "",
  is_featured: false,
  is_published: true,
  display_order: 0,
};

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setTestimonials(await getTestimonials());
      setError("");
    } catch (requestError) {
      setError(
        requestError?.message?.includes("testimonials")
          ? "La table des témoignages n’existe pas encore. Exécutez supabase/testimonials.sql dans Supabase."
          : "Impossible de charger les témoignages.",
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const screenshot = form.get("screenshot");
      let screenshotUrl = editing?.screenshot_url || null;
      if (screenshot instanceof File && screenshot.size > 0) {
        screenshotUrl = await uploadTestimonialScreenshot(screenshot);
      }
      const ratingValue = String(form.get("rating") || "");
      await saveTestimonial({
        id: editing?.id,
        client_name: String(form.get("client_name")).trim(),
        source: String(form.get("source")),
        service: String(form.get("service")).trim(),
        quote: String(form.get("quote")).trim(),
        rating: ratingValue ? Number(ratingValue) : null,
        review_date: String(form.get("review_date") || "") || null,
        screenshot_url: screenshotUrl,
        is_featured: form.get("is_featured") === "on",
        is_published: form.get("is_published") === "on",
        display_order: Number(form.get("display_order") || 0),
        updated_at: new Date().toISOString(),
      });
      setEditing(null);
      await load();
    } catch (requestError) {
      setError(
        requestError?.message ||
          "L’enregistrement a échoué. Vérifiez la table et le stockage Supabase.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer définitivement ce témoignage ?")) return;
    try {
      await deleteTestimonial(id);
      await load();
    } catch (requestError) {
      setError(requestError?.message || "La suppression a échoué.");
    }
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>PREUVES DE CONFIANCE</span>
          <h1>Témoignages</h1>
          <p>
            Publiez des avis uniformes tout en conservant leur capture
            originale.
          </p>
        </div>
        <button onClick={() => setEditing(emptyTestimonial)}>
          <Plus /> Ajouter un avis
        </button>
      </header>

      {error && <p className="admin-data-message error">{error}</p>}

      <section className="admin-testimonial-grid">
        {testimonials.map((item) => (
          <article
            key={item.id}
            className={!item.is_published ? "disabled" : ""}
          >
            <div className="admin-testimonial-proof">
              {item.screenshot_url ? (
                <img
                  src={item.screenshot_url}
                  alt={`Avis de ${item.client_name}`}
                />
              ) : (
                <ImageIcon />
              )}
            </div>
            <div className="admin-testimonial-copy">
              <div>
                <span>{item.source}</span>
                {item.is_featured && <strong>Mis en avant</strong>}
              </div>
              <h2>{item.client_name}</h2>
              <small>{item.service}</small>
              <p>« {item.quote} »</p>
              <div className="admin-testimonial-meta">
                {item.rating ? (
                  <span>
                    <Star /> {item.rating}/5
                  </span>
                ) : (
                  <span>Sans note</span>
                )}
                <span>
                  {item.is_published ? <Eye /> : <EyeOff />}{" "}
                  {item.is_published ? "Publié" : "Masqué"}
                </span>
              </div>
            </div>
            <footer>
              <button type="button" onClick={() => setEditing(item)}>
                <Edit3 /> Modifier
              </button>
              <button type="button" onClick={() => remove(item.id)}>
                <Trash2 /> Supprimer
              </button>
            </footer>
          </article>
        ))}
      </section>

      {editing && (
        <div className="admin-modal">
          <form className="admin-testimonial-form" onSubmit={submit}>
            <div className="admin-modal-head">
              <div>
                <span>TÉMOIGNAGE</span>
                <h2>{editing.id ? "Modifier l’avis" : "Ajouter un avis"}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </div>
            <div className="admin-form-fields two">
              <label>
                Nom ou pseudonyme
                <input
                  name="client_name"
                  required
                  defaultValue={editing.client_name}
                />
              </label>
              <label>
                Plateforme
                <select name="source" defaultValue={editing.source}>
                  <option>ComeUp</option>
                  <option>WhatsApp</option>
                  <option>Fiverr</option>
                  <option>Direct</option>
                  <option>Autre</option>
                </select>
              </label>
              <label>
                Service réalisé
                <input name="service" required defaultValue={editing.service} />
              </label>
              <label>
                Note
                <select name="rating" defaultValue={editing.rating || ""}>
                  <option value="">Sans note</option>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} sur 5
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date de l’avis
                <input
                  name="review_date"
                  type="date"
                  defaultValue={editing.review_date || ""}
                />
              </label>
              <label>
                Ordre d’affichage
                <input
                  name="display_order"
                  type="number"
                  min="0"
                  defaultValue={editing.display_order || 0}
                />
              </label>
            </div>
            <label>
              Témoignage
              <textarea name="quote" required defaultValue={editing.quote} />
            </label>
            <label>
              Capture originale
              <input
                name="screenshot"
                type="file"
                accept="image/png,image/jpeg,image/webp"
              />
            </label>
            {editing.screenshot_url && (
              <img
                className="admin-testimonial-preview"
                src={editing.screenshot_url}
                alt="Capture actuelle"
              />
            )}
            <div className="admin-testimonial-options">
              <label>
                <input
                  name="is_featured"
                  type="checkbox"
                  defaultChecked={editing.is_featured}
                />{" "}
                Mettre en avant
              </label>
              <label>
                <input
                  name="is_published"
                  type="checkbox"
                  defaultChecked={editing.is_published}
                />{" "}
                Publier sur le site
              </label>
            </div>
            <button className="admin-form-submit" disabled={saving}>
              {saving ? "Enregistrement en cours" : "Enregistrer le témoignage"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
