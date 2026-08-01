import React, { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ImagePlus,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { defaultSiteContent } from "../../data/siteContent";
import {
  getSiteContent,
  saveSiteContent,
  uploadProfilePhoto,
} from "../../lib/portfolioApi";

export default function ContentAdmin() {
  const [content, setContent] = useState(defaultSiteContent);
  const [status, setStatus] = useState("idle");
  const [openSection, setOpenSection] = useState("profile");
  useEffect(() => {
    getSiteContent()
      .then(setContent)
      .catch(() => {});
  }, []);

  function setSection(section, key, value) {
    setContent((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
  }
  function updateExperience(index, key, value) {
    const experiences = content.cv.experiences.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );
    setSection("cv", "experiences", experiences);
  }
  function updateEducation(index, key, value) {
    const education = content.cv.education.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );
    setSection("cv", "education", education);
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("saving");
    try {
      const photoUrl = await uploadProfilePhoto(file);
      setSection("profile", "photoUrl", photoUrl);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }
  async function submit(event) {
    event.preventDefault();
    setStatus("saving");
    try {
      await saveSiteContent(content);
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <span>CONTENUS DU SITE</span>
          <h1>Gérer votre portfolio</h1>
          <p>Modifiez votre identité, vos textes, vos réseaux et votre CV.</p>
        </div>
      </header>
      <nav className="admin-content-tabs" aria-label="Pages à modifier">
        {[
          ["profile", "Profil"],
          ["social", "Réseaux"],
          ["home", "Accueil"],
          ["about", "À propos"],
          ["experiences", "CV Expériences"],
          ["education", "CV Formations"],
        ].map(([value, label]) => (
          <button
            type="button"
            className={openSection === value ? "active" : ""}
            onClick={() => setOpenSection(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </nav>
      <form className="admin-content-form" onSubmit={submit}>
        <section
          className={openSection === "profile" ? "" : "admin-tab-hidden"}
        >
          <div className="admin-form-section-title">
            <span>IDENTITÉ</span>
            <h2>Profil et photo</h2>
            <button
              type="button"
              className="admin-section-toggle"
              onClick={() =>
                setOpenSection(openSection === "profile" ? "" : "profile")
              }
            >
              <ChevronDown />
            </button>
          </div>
          <div className="admin-form-fields two">
            <div className="admin-photo-editor">
              <img src={content.profile.photoUrl} alt="Photo de profil" />
              <label>
                <ImagePlus /> Remplacer la photo
                <input type="file" accept="image/*" onChange={upload} />
              </label>
            </div>
            <div>
              <label>
                Nom complet
                <input
                  value={content.profile.fullName}
                  onChange={(e) =>
                    setSection("profile", "fullName", e.target.value)
                  }
                />
              </label>
              <label>
                Alias
                <input
                  value={content.profile.alias}
                  onChange={(e) =>
                    setSection("profile", "alias", e.target.value)
                  }
                />
              </label>
            </div>
            <label>
              Localisation
              <input
                value={content.profile.location}
                onChange={(e) =>
                  setSection("profile", "location", e.target.value)
                }
              />
            </label>
            <label>
              Poste actuel
              <input
                value={content.profile.job}
                onChange={(e) => setSection("profile", "job", e.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={content.profile.email}
                onChange={(e) => setSection("profile", "email", e.target.value)}
              />
            </label>
            <label>
              Numéro WhatsApp
              <input
                value={content.profile.whatsapp}
                onChange={(e) =>
                  setSection("profile", "whatsapp", e.target.value)
                }
              />
            </label>
          </div>
        </section>
        <section className={openSection === "social" ? "" : "admin-tab-hidden"}>
          <div className="admin-form-section-title">
            <span>RÉSEAUX SOCIAUX</span>
            <h2>Vos liens</h2>
            <button
              type="button"
              className="admin-section-toggle"
              onClick={() =>
                setOpenSection(openSection === "social" ? "" : "social")
              }
            >
              <ChevronDown />
            </button>
          </div>
          <div className="admin-form-fields two">
            {Object.entries(content.social).map(([key, value]) => (
              <label key={key}>
                {key}
                <input
                  type="url"
                  value={value}
                  onChange={(e) => setSection("social", key, e.target.value)}
                  placeholder="https://"
                />
              </label>
            ))}
          </div>
        </section>
        <section className={openSection === "home" ? "" : "admin-tab-hidden"}>
          <div className="admin-form-section-title">
            <span>ACCUEIL</span>
            <h2>Message principal</h2>
            <button
              type="button"
              className="admin-section-toggle"
              onClick={() =>
                setOpenSection(openSection === "home" ? "" : "home")
              }
            >
              <ChevronDown />
            </button>
          </div>
          <div className="admin-form-fields">
            {Object.entries(content.home).map(([key, value]) => (
              <label key={key}>
                {key}
                <textarea
                  value={value}
                  onChange={(e) => setSection("home", key, e.target.value)}
                />
              </label>
            ))}
          </div>
        </section>
        <section className={openSection === "about" ? "" : "admin-tab-hidden"}>
          <div className="admin-form-section-title">
            <span>À PROPOS</span>
            <h2>Votre histoire</h2>
            <button
              type="button"
              className="admin-section-toggle"
              onClick={() =>
                setOpenSection(openSection === "about" ? "" : "about")
              }
            >
              <ChevronDown />
            </button>
          </div>
          <div className="admin-form-fields">
            {Object.entries(content.about).map(([key, value]) => (
              <label key={key}>
                {key}
                <textarea
                  value={value}
                  onChange={(e) => setSection("about", key, e.target.value)}
                />
              </label>
            ))}
          </div>
        </section>
        <section
          className={`admin-content-wide ${openSection === "experiences" ? "" : "admin-tab-hidden"}`}
        >
          <div className="admin-form-section-title">
            <span>CV</span>
            <h2>Expériences</h2>
            <button
              type="button"
              className="admin-section-toggle"
              onClick={() =>
                setOpenSection(
                  openSection === "experiences" ? "" : "experiences",
                )
              }
            >
              <ChevronDown />
            </button>
            <button
              type="button"
              className="admin-inline-add"
              onClick={() =>
                setSection("cv", "experiences", [
                  ...content.cv.experiences,
                  {
                    period: "",
                    role: "",
                    company: "",
                    place: "",
                    description: "",
                    current: false,
                  },
                ])
              }
            >
              <Plus /> Ajouter
            </button>
          </div>
          <div className="admin-repeat-list">
            {content.cv.experiences.map((item, index) => (
              <article key={index}>
                {["period", "role", "company", "place", "description"].map(
                  (key) => (
                    <label key={key}>
                      {key}
                      <input
                        value={item[key]}
                        onChange={(e) =>
                          updateExperience(index, key, e.target.value)
                        }
                      />
                    </label>
                  ),
                )}
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(e) =>
                      updateExperience(index, "current", e.target.checked)
                    }
                  />{" "}
                  Expérience actuelle
                </label>
                <button
                  type="button"
                  className="admin-remove"
                  onClick={() =>
                    setSection(
                      "cv",
                      "experiences",
                      content.cv.experiences.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 /> Retirer
                </button>
              </article>
            ))}
          </div>
        </section>
        <section
          className={`admin-content-wide ${openSection === "education" ? "" : "admin-tab-hidden"}`}
        >
          <div className="admin-form-section-title">
            <span>CV</span>
            <h2>Formations</h2>
            <button
              type="button"
              className="admin-section-toggle"
              onClick={() =>
                setOpenSection(openSection === "education" ? "" : "education")
              }
            >
              <ChevronDown />
            </button>
            <button
              type="button"
              className="admin-inline-add"
              onClick={() =>
                setSection("cv", "education", [
                  ...content.cv.education,
                  { period: "", title: "", school: "", place: "" },
                ])
              }
            >
              <Plus /> Ajouter
            </button>
          </div>
          <div className="admin-repeat-list">
            {content.cv.education.map((item, index) => (
              <article key={index}>
                {["period", "title", "school", "place"].map((key) => (
                  <label key={key}>
                    {key}
                    <input
                      value={item[key]}
                      onChange={(e) =>
                        updateEducation(index, key, e.target.value)
                      }
                    />
                  </label>
                ))}
                <button
                  type="button"
                  className="admin-remove"
                  onClick={() =>
                    setSection(
                      "cv",
                      "education",
                      content.cv.education.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 /> Retirer
                </button>
              </article>
            ))}
          </div>
        </section>
        {status === "error" && (
          <p className="admin-data-message error">
            Une erreur est survenue. Vérifiez la configuration Supabase.
          </p>
        )}
        <button
          className="admin-save-content"
          type="submit"
          disabled={status === "saving"}
        >
          {status === "saved" ? (
            <>
              <Check /> Modifications enregistrées
            </>
          ) : (
            <>
              <Save />{" "}
              {status === "saving"
                ? "Enregistrement"
                : "Enregistrer les modifications"}
            </>
          )}
        </button>
      </form>
    </>
  );
}
