import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, logout, register } from "../../../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";

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
    logoutMutation,
  };
};
