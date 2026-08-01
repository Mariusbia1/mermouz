import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pageMotion } from "../config/motion";
import { createContactRequest } from "../lib/portfolioApi";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [whatsapp, setWhatsapp] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);

    if (!whatsapp || !isValidPhoneNumber(whatsapp)) {
      setStatus("phone-error");
      return;
    }

    try {
      await createContactRequest({
        name: String(form.get("name") || "").trim(),
        email: String(form.get("email") || "").trim(),
        whatsapp,
        message: String(form.get("message") || "").trim(),
      });
      event.currentTarget.reset();
      setWhatsapp("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.main className="page inner-page contact-page" {...pageMotion}>
      <header className="page-head">
        <span>CONTACT</span>
        <h1>
          Construisons quelque
          <br />
          <em>chose de solide.</em>
        </h1>
      </header>
      <section className="contact-grid">
        <div>
          <p>
            Un projet, une idée ou un problème à résoudre ? Écrivez-moi. Je
            réponds généralement sous 24 heures.
          </p>
          <a href="mailto:hello@mermouz.com">
            hello@mermouz.com <ArrowUpRight />
          </a>
        </div>
        <form onSubmit={submit}>
          <label>
            VOTRE NOM
            <input
              name="name"
              required
              placeholder="Comment vous appelez-vous ?"
            />
          </label>
          <label>
            VOTRE EMAIL
            <input
              name="email"
              type="email"
              required
              placeholder="vous@entreprise.com"
            />
          </label>
          <label>
            VOTRE NUMÉRO WHATSAPP
            <PhoneInput
              name="whatsapp"
              international
              defaultCountry="BJ"
              countryCallingCodeEditable={false}
              value={whatsapp}
              onChange={(value) => setWhatsapp(value || "")}
              error={whatsapp ? !isValidPhoneNumber(whatsapp) : undefined}
              required
              placeholder="Votre numéro WhatsApp"
            />
          </label>
          <label>
            PARLEZ-MOI DU PROJET
            <textarea
              name="message"
              required
              placeholder="Objectifs, contexte, délai..."
            />
          </label>
          {status === "success" && (
            <p className="contact-feedback success">
              Votre demande a bien été envoyée. Je vous répondrai rapidement.
            </p>
          )}
          {status === "error" && (
            <p className="contact-feedback error">
              L’envoi a échoué. Veuillez réessayer dans quelques instants.
            </p>
          )}
          {status === "phone-error" && (
            <p className="contact-feedback error">
              Sélectionnez votre pays et renseignez un numéro WhatsApp valide.
            </p>
          )}
          <button className="button primary" disabled={status === "loading"}>
            {status === "loading" ? "Envoi en cours" : "Envoyer ma demande"}{" "}
            <ArrowRight />
          </button>
        </form>
      </section>
    </motion.main>
  );
}
