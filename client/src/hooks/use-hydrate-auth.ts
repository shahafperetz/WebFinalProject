import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

export const useHydrateAuth = () => {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);
};
