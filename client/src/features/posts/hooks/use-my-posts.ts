import { useQuery } from "@tanstack/react-query";
import { getMyPosts } from "../api/posts.api";

export const useMyPosts = () => {
  return useQuery({
    queryKey: ["my-posts"],
    queryFn: () => getMyPosts(0, 10),
  });
};
