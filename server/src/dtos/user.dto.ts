export type UserResponseDto = {
    _id: string;
    username: string;
    email?: string;
    image?: string;
  };
  
  export type UpdateMyInfoDto = {
    username?: string;
  };