import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts.api";

const POSTS_LIMIT = 10;

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 0 }) => getPosts(pageParam, POSTS_LIMIT),
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
