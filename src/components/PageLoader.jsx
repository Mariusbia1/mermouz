import React from "react";

export default function PageLoader() {
  return (
    <div
      className="site-loader is-visible"
      role="status"
      aria-label="Chargement en cours"
    >
      <div className="loader-mark">
        <span className="loader-ring" />
        <span className="loader-ring loader-ring-inner" />
        <strong>
          Marius BIAOU<em>.</em>
        </strong>
      </div>
      <small>Chargement en cours</small>
    </div>
  );
}
