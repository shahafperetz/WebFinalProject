export type CreatePostDto = {
    text?: string;
  };
  
  export type UpdatePostDto = {
    text?: string;
  };
  
  export type PostOwnerDto = {
    _id: string;
    username: string;
    image?: string;
  };
  
  export type PostResponseDto = {
    _id: string;
    owner: PostOwnerDto;
    text: string;
    image?: string;
    commentsCount: number;
    likesCount: number;
    likedByMe: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
  export type PostsListResponseDto = {
    skip: number;
    limit: number;
    items: PostResponseDto[];
  };
  
  export type ToggleLikeResponseDto = {
    postId: string;
    likesCount: number;
    likedByMe: boolean;
  };