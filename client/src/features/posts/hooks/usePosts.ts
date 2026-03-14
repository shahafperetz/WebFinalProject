import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts.api";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(0, 10),
  });
};
