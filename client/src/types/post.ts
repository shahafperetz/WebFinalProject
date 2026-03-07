export type Post = {
  id: string;
  userId: string;
  username: string;
  userProfileImage?: string;
  imageUrl?: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  isOwner: boolean;
};
