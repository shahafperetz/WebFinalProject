import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useHydrateAuth } from "./hooks/useHydrateAuth";

const queryClient = new QueryClient();

function AppProviders() {
  useHydrateAuth();

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <AppProviders />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
