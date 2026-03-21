import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/auth.store";
import { googleLogin, login, logout, register } from "../api/auth.api";

export const useAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      navigate("/");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      navigate("/login");
    },
  });

  return {
    loginMutation,
    registerMutation,
    googleLoginMutation,
    logoutMutation,
  };
};
