export interface User {
    username: string;
    password: string
}

export interface AccessTokenInfo {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
  }

export interface UserState extends User {
    isAuthenticated: boolean;
    id: Number
    name: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
    accessTokenInfo: AccessTokenInfo
}