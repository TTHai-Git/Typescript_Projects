import { Role } from "./Role";


export interface User {
    username: string;
    password: string
}

export interface TokenInfo {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
  }

export interface UserState extends User {
    isAuthenticated: boolean;
    _id:string;
    role: Role
    name: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
    tokenInfo: TokenInfo
}