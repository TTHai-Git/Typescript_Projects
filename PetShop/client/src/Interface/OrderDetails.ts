import { Category } from "./Category";
import Product from "./Product";

interface OrderDetails {
    orderId: string,
    product: Product,
    category: Category
    quantity: number,
    totalPrice: number,
    note: string
}
export default OrderDetails