import { RouterProvider } from "react-router-dom";
import { useHydrateAuth } from "../hooks/use-hydrate-auth";
import { router } from "../router";

export const AppProviders = () => {
  useHydrateAuth();

  return <RouterProvider router={router} />;
};
