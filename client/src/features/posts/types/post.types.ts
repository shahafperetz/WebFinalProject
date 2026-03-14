export type PostOwner = {
  _id: string;
  username: string;
  image?: string;
};

export type Post = {
  _id: string;
  owner: PostOwner;
  text: string;
  image: string;
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedPostsResponse = {
  skip: number;
  limit: number;
  items: Post[];
};
