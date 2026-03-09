import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AppProviders = () => {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <AppProviders />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
