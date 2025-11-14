import Product from "./Product";

export default interface Favorite {
    _id: string,
    userId: string,
    product: Product
    createdAt: Date,
    updatedAt: Date,
}