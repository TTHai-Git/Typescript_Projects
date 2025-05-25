import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router";
import Product from "../Interface/Product";

interface CartContextType {
  cartItems: Product[];
  addToCart: (item: Product, quantity: number) => void;
  removeFromCart: (_id: string) => void;
  increaseQuantity: (_id: string) => void;
  decreaseQuantity: (_id: string) => void;
  checkOutFromCart: () => void;
  caculateTotalOfCart: () => Number;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  checkOutFromCart: () => {},
  caculateTotalOfCart:  Number,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const addToCart = (item: Product, quantity:number) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i._id === item._id);
      if (itemInCart) {
          return prevItems.map((i) => i._id === item._id ? { ...i, quantity: (i.quantity || 1) + quantity } : i);
      }
      return [...prevItems, { ...item, quantity: quantity }];
    })
    alert(`${item.name} has been added to your cart!`)
  };

  

  const removeFromCart = (_id: string) => {
    if (!window.confirm('Are you sure you want to remove this item from cart?')) return;
    setCartItems(prev => prev.filter(item => item._id !== _id ));
  };

  const increaseQuantity = (_id: string) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i._id === _id);
      if (itemInCart) {
        return prevItems.map((i) =>
          i._id === _id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prevItems];
    });
  };

  const decreaseQuantity = (_id: string) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i._id === _id);
      if (!itemInCart) return prevItems;
  
      // If quantity > 1, just decrease
      if (itemInCart.quantity && itemInCart.quantity > 1) {
        return prevItems.map((i) =>
          i._id === _id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
        );
      }
  
      // If quantity === 1, ask for confirmation before removing
      const confirmed = window.confirm(
        "Quantity will reach 0. Do you want to remove this item from the cart?"
      );
      if (confirmed) {
        return prevItems.filter((i) => i._id !== _id);
      }
  
      return prevItems; // Don't change anything if not confirmed
    });
  };
  

  const caculateTotalOfCart = () => {
    const total:Number = cartItems.reduce((sum:number, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    return total
  }

  const checkOutFromCart = () => {
    alert(`Thank you for shopping with us! Total: $${Number(caculateTotalOfCart())}`);
    setCartItems([]);
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, increaseQuantity, checkOutFromCart, caculateTotalOfCart }}>
      {children}
    </CartContext.Provider>
  );
};