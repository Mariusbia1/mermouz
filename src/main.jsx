import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import "react-phone-number-input/style.css";

const rootElement = document.getElementById("root");
const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme =
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

document.documentElement.dataset.theme = initialTheme;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur de rendu du portfolio:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main
          style={{
            minHeight: "100vh",
            padding: 48,
            color: "#e8edf2",
            background: "#0b0f14",
            fontFamily: "system-ui,sans-serif",
          }}
        >
          <h1 style={{ fontSize: 28 }}>Le portfolio n'a pas pu s'afficher.</h1>
          <p style={{ maxWidth: 760, color: "#9da9b5", lineHeight: 1.6 }}>
            {String(this.state.error.message || this.state.error)}
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}

function showFatalError(error) {
  console.error("Erreur au démarrage du portfolio:", error);
  rootElement.innerHTML = `
    <main style="min-height:100vh;padding:48px;color:#e8edf2;background:#0b0f14;font-family:system-ui,sans-serif">
      <h1 style="font-size:28px">Le portfolio n'a pas pu démarrer.</h1>
      <p style="max-width:760px;color:#9da9b5;line-height:1.6">${String(error?.message || error)}</p>
    </main>`;
}

window.addEventListener("error", (event) =>
  showFatalError(event.error || event.message),
);
window.addEventListener("unhandledrejection", (event) =>
  showFatalError(event.reason),
);

rootElement.innerHTML = '<div class="app-boot-screen"></div>';

import("./App.jsx")
  .then(({ default: App }) => {
    ReactDOM.createRoot(rootElement).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    );
  })
  .catch(showFatalError);
