export type RegisterDto = {
    username?: string;
    email?: string;
    password?: string;
  };
  
  export type LoginDto = {
    username?: string;
    password?: string;
  };
  
  export type GoogleSigninDto = {
    credential?: string;
  };
  
  export type AuthUserDto = {
    _id: string;
    username: string;
    email: string;
    image?: string;
  };
  
  export type AuthResponseDto = {
    accessToken: string;
    user: AuthUserDto;
  };
  
  export type RefreshResponseDto = {
    accessToken: string;
  };