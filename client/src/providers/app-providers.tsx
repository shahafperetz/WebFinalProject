import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { router } from "../router";

export const AppProviders = () => {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return <RouterProvider router={router} />;
};
