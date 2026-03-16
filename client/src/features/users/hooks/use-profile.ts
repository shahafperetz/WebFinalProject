import { useQuery } from "@tanstack/react-query";
import { getMyInfo, getUserById } from "../api/users.api";

export const useProfile = (userId?: string, isMe = false) => {
  return useQuery({
    queryKey: ["profile", isMe ? "me" : userId],
    queryFn: () => (isMe ? getMyInfo() : getUserById(userId!)),
    enabled: isMe || !!userId,
  });
};
