export default interface Payment {
    paymentId: string,
    method: string
    provider: string,
    transactionId: string,
    status: string,
    amount: Number,
    extraDate: object
}