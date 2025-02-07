import { createContext, ReactNode, useContext, useState } from "react";
import { DogsCart } from "../Interface/Dogs";
import { useNavigate } from "react-router";

interface CartContextType {
  cartItems: DogsCart[];
  addToCart: (item: DogsCart) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  checkOutFromCart: () => void;

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
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<DogsCart[]>([]);
  const navigate = useNavigate();

  const addToCart = (item: DogsCart) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i.id === item.id);
      if (itemInCart) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    })
    alert(`${item.name} has been added to your cart!`)
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i.id === id);
      if (itemInCart) {
        return prevItems.map((i) =>
          i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prevItems];
    });
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i.id === id);
      if (itemInCart && itemInCart.quantity && itemInCart.quantity > 1) {
        return prevItems.map((i) =>
          i.id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
        );
      }
      else{
        return prevItems.filter((i) => i.id !== id);
      }
      
    });
  };

  const checkOutFromCart = () => {
    const total:Number = cartItems.reduce((sum:number, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    alert(`Thank you for shopping with us! Total: $${Number(total)}`);
    setCartItems([]);
    navigate('/');

  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, increaseQuantity, checkOutFromCart }}>
      {children}
    </CartContext.Provider>
  );
};