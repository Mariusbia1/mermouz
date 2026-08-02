import React from "react";
import { createPortal } from "react-dom";

export default function PageLoader() {
  const loader = (
    <div
      className="site-loader is-visible"
      role="status"
      aria-label="Chargement en cours"
    >
      <div className="loader-mark">
        <span className="loader-ring" />
        <span className="loader-ring loader-ring-inner" />
        <strong>MB</strong>
      </div>
      <div className="loader-copy">
        <strong>
          Marius BIAOU<em>.</em>
        </strong>
        <small>Chargement en cours</small>
      </div>
    </div>
  );

  return createPortal(loader, document.body);
}
