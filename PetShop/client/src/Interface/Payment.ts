export default interface Payment {
    _id: string,
    method: string,
    provider: string,
    status: string,
    order: string,
    createdAt: string,
    updatedAt: string,
}
export interface PaymentDetails extends Payment {
    extraData: object
}