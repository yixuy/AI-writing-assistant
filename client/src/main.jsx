import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { PrivyProvider } from "@privy-io/react-auth";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmcavuofo00hcl10nr88berxo"
      // clientId="your-app-client-id"
      config={{
        loginMethods: ["email", "google", "phone"],
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
