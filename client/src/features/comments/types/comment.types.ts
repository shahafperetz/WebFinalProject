export type CommentOwner = {
  _id: string;
  username: string;
  image?: string;
};

export type Comment = {
  _id: string;
  postId: string;
  owner: CommentOwner;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedCommentsResponse = {
  skip: number;
  limit: number;
  items: Comment[];
};
