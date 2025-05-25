import Payment from "./Payment"

interface Order {
    orderId: string,
    userId: string,
    payment: Payment
    totalPrice:number,
    status: string,
    createdAt: string,
    updatedAt: string,
}
export default Order