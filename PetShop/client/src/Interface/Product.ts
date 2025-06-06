
import { Brand } from "./Brand";
import Breed from "./Breed";
import { Category } from "./Category";
import { Vendor } from "./Vendor";

export default interface Product extends ProductCart {
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
    createdAt: Date;
    updatedAt: Date;
    totalRating?: number;
    beforeTotalRatingRounded?: number
    totalOrder?:number
    
}

export interface ProductCart {
    quantity?: number;
    note?: string;
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

export interface ProductDog extends Product {
    size: string[];
    age: number;
    color: string[];
    weight: number;
    height: number;
    breed: Breed;
}