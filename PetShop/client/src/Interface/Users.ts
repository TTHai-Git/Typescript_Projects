import { Role } from "./Role";

export interface User {
    username: string;
    password: string
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
    isVerified: boolean;
    isAuthenticated2Fa: boolean;
    secretKey2FA: string;
}