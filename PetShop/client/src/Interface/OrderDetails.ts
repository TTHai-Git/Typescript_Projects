import { Dog } from "./Dogs"

interface OrderDetails {
    orderId: string,
    dog: Dog,
    quantity: number,
    price: number,
}
export default OrderDetails