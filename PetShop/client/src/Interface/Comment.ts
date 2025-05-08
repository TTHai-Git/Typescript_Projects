export interface Comment {
    userId: string;
    productId: string;
    content: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}