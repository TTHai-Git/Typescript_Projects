import { createContext, ReactNode, useContext, useState } from "react";
import Product from "../Interface/Product";
import { useNotification } from "./Notification";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Product, quantity: number) => void;
  removeFromCart: (_id: string) => void;
  increaseQuantity: (_id: string, stock: number) => void;
  decreaseQuantity: (_id: string) => void;
  checkOutFromCart: () => void;
  caculateTotalOfCart: () => number;
}

interface CartProviderProps {
  children: ReactNode;
}

// Extend Product to include quantity for the cart
type CartItem = Product & { quantity: number };

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  checkOutFromCart: () => {},
  caculateTotalOfCart: () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { showNotification } = useNotification();

  // Helper for showing notifications
  const notify = (message: string, type: "success" | "warning") => {
    showNotification(message, type);
  };

  const addToCart = (item: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i._id === item._id);

      if (itemInCart) {
        const isAvailableStock = itemInCart.quantity + quantity <= item.stock;

        if (!isAvailableStock) {
          notify(`Only ${item.stock} items available in stock.`, "warning");
          return prevItems;
        }

        notify(
          `${item.name} has been added to your cart with ${quantity} items!`,
          "success"
        );

        return prevItems.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      if (quantity > item.stock) {
        notify(`Only ${item.stock} items available in stock.`, "warning");
        return prevItems;
      }

      notify(
        `${item.name} has been added to your cart with ${quantity} items!`,
        "success"
      );

      return [...prevItems, { ...item, quantity }];
    });
  };

  const removeFromCart = (_id: string) => {
    if (!window.confirm("Are you sure you want to remove this item from cart?"))
      return;
    setCartItems((prev) => prev.filter((item) => item._id !== _id));
  };

  const increaseQuantity = (_id: string, stock: number) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i._id === _id);
      if (!itemInCart) return prevItems;

      if (itemInCart.quantity + 1 > stock) {
        notify(`Only ${stock} items available in stock.`, "warning");
        return prevItems;
      }

      return prevItems.map((i) =>
        i._id === _id ? { ...i, quantity: i.quantity + 1 } : i
      );
    });
  };

  const decreaseQuantity = (_id: string) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i._id === _id);
      if (!itemInCart) return prevItems;

      if (itemInCart.quantity > 1) {
        return prevItems.map((i) =>
          i._id === _id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }

      const confirmed = window.confirm(
        "Quantity will reach 0. Do you want to remove this item from the cart?"
      );
      if (confirmed) {
        return prevItems.filter((i) => i._id !== _id);
      }

      return prevItems;
    });
  };

  const caculateTotalOfCart = () => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  };

  const checkOutFromCart = () => {
    notify(
      `Thank you for shopping with us! Total: $${caculateTotalOfCart()}`,
      "success"
    );
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        checkOutFromCart,
        caculateTotalOfCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
