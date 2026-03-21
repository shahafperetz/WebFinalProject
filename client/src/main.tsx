import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "./providers/app-providers";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <AppProviders />
        </QueryClientProvider>
      </ChakraProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
