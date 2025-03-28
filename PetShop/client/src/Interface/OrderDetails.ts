import { Dog } from "./Dogs"

interface OrderDetails {
    sTT: number,
    orderId: string,
    dog: Dog,
    quantity: number,
    totalPrice: number,
}
export default OrderDetails