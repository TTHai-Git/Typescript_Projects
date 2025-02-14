import { createContext, ReactNode, useContext, useState } from "react";
import { DogsCart } from "../Interface/Dogs";
import { useNavigate } from "react-router";

interface CartContextType {
  cartItems: DogsCart[];
  addToCart: (item: DogsCart) => void;
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
  const [cartItems, setCartItems] = useState<DogsCart[]>([]);
  const navigate = useNavigate();

  const addToCart = (item: DogsCart) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((i) => i._id === item._id);
      if (itemInCart) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    })
    alert(`${item.name} has been added to your cart!`)
  };

  const removeFromCart = (_id: string) => {
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
      if (itemInCart && itemInCart.quantity && itemInCart.quantity > 1) {
        return prevItems.map((i) =>
          i._id === _id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
        );
      }
      else{
        return prevItems.filter((i) => i._id !== _id);
      }
      
    });
  };

  const caculateTotalOfCart = () => {
    const total:Number = cartItems.reduce((sum:number, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    return total
  }

  const checkOutFromCart = () => {
    alert(`Thank you for shopping with us! Total: $${Number(caculateTotalOfCart())}`);
    setCartItems([]);
    navigate('/');
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, increaseQuantity, checkOutFromCart, caculateTotalOfCart }}>
      {children}
    </CartContext.Provider>
  );
};