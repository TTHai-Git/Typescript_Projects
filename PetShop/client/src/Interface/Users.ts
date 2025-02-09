export interface User {
    username: string;
    password: string
}

export interface AccessTokenInfo {
    accessToken: string;
    expiresIn: number;
  }

export interface UserState extends User {
    isAuthenticated: boolean;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
    accessTokenInfo: AccessTokenInfo
}