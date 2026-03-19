import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyPosts } from "../api/posts.api";

const POSTS_LIMIT = 10;

export const useMyPosts = () => {
  return useInfiniteQuery({
    queryKey: ["my-posts"],
    queryFn: ({ pageParam = 0 }) => getMyPosts(pageParam, POSTS_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.items.length;

      if (lastPage.items.length < lastPage.limit) {
        return undefined;
      }

      return nextSkip;
    },
  });
};
