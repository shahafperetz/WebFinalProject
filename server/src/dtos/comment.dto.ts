export type CreateCommentDto = {
    text?: string;
  };
  
  export type CommentOwnerDto = {
    _id: string;
    username: string;
    image?: string;
  };
  
  export type CommentResponseDto = {
    _id: string;
    postId: string;
    owner: CommentOwnerDto;
    text: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export type CommentsListResponseDto = {
    skip: number;
    limit: number;
    items: CommentResponseDto[];
  };