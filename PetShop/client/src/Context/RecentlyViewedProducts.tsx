
import React, { createContext, ReactNode, useContext } from "react";
import Product from "../Interface/Product";

interface RecentlyViewedProductsContextType {
    recentlyViewedProducts: Product[],
    addToRecentlyViewedProducts: (item: Product) => void
    removeFromRecentlyViewedProducts: (_id: string) => void;
    clearRecentlyViewedProducts: () => void;
}

interface RecentlyViewedProductsProviderProps {
    children: ReactNode
}

const RecentlyViewedProductsContext = createContext<RecentlyViewedProductsContextType>({
    recentlyViewedProducts: [],
    addToRecentlyViewedProducts: () => {},
    removeFromRecentlyViewedProducts: () => {},
    clearRecentlyViewedProducts: () => {}
})
export const useRecentlyViewedProducts = () => useContext(RecentlyViewedProductsContext)

export const RecentlyViewedProductsProvider: React.FC<RecentlyViewedProductsProviderProps> = ({ children }) => {
    const [recentlyViewedProducts, setRecentlyViewedProducts] = React.useState<any[]>([])

    const addToRecentlyViewedProducts = (item: Product) => {
        setRecentlyViewedProducts((prevItems) => {
            const itemInRecentlyViewed = prevItems.find((i) => i._id === item._id);
            if (itemInRecentlyViewed) {
                return prevItems;
            } else {
                if (prevItems.length >= 10) {
                    const updatedItems = prevItems.slice(1); // Remove the oldest item
                    return [...updatedItems, item]; // Add the new item
                } else {
                    return [...prevItems, item]; // Just add the new item
                }
            }
        })
        // console.log("RecentlyViewedProducts", recentlyViewedProducts)
        
    }

    const removeFromRecentlyViewedProducts = (_id: string) => {
        setRecentlyViewedProducts((prevItems) => prevItems.filter((i) => i._id !== _id))
    }
    
    const clearRecentlyViewedProducts = () => {
        setRecentlyViewedProducts([])
    }

    return (
    <RecentlyViewedProductsContext.Provider value={{ recentlyViewedProducts, addToRecentlyViewedProducts, removeFromRecentlyViewedProducts, clearRecentlyViewedProducts }}>
      {children}
    </RecentlyViewedProductsContext.Provider>
  );
}