
import { Brand } from "./Brand";
import { Category } from "./Category";
import { Vendor } from "./Vendor";

export default interface Product {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    status: boolean;
    category: Category;
    type: string;
    brand: Brand;
    vendor: Vendor;
    createAt: Date;
    updateAt: Date;
}

export interface ProductFood extends Product {
    ingredients: string[];
    expirationDate: Date;
    isGrainFree: boolean;
    recommendedFor: string[];
}

export interface ProductClothes extends Product {
    size: string[];
    material: string[];
    color: string[];
    season: string;
}

export interface ProductAccessories extends Product {
    dimensions: string;
    material: string[];
    usage: string;
}