export interface Voucher {
    _id: string;
    code: string;
    discount: number;
    expiryDate: Date;
    isActive: Boolean;
    minimumPrice: number;
    usageCount: number;
    maxUsage: number;
    type: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}