import Product from "./Product";

interface OrderDetails {
    orderId: string,
    product: Product,
    quantity: number,
    totalPrice: number,
    note: string
}
export default OrderDetails