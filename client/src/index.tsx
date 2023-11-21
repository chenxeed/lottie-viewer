import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration
  .register({
    onUpdate: (registration) => {
      const waitingServiceWorker = registration.waiting;

      if (waitingServiceWorker) {
        waitingServiceWorker.addEventListener("statechange", (event) => {
          if (
            (event.target as null | { state: string })?.state === "activated"
          ) {
            window.location.reload();
          }
        });
        waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
      }
    },
  })
  .then(() => {
    const root = ReactDOM.createRoot(
      document.getElementById("root") as HTMLElement,
    );
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
