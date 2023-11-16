import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Theme } from "./ThemeProvider";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { preloadResources } from "./service/preloadResources";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register().then((isServiceWorker) => {
  // Upon load, preload certain resources needed for the app to function normally.
  // This is meant for users who are offline right after visit, and have not yet browsed the app further.
  preloadResources();

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );
  root.render(
    <React.StrictMode>
      <Theme>
        <App />
      </Theme>
    </React.StrictMode>,
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
});
