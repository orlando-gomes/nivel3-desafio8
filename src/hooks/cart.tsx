import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const JSONProducts = await AsyncStorage.getItem('GoMarketplace:products');

      if (JSONProducts) {
        setProducts(JSON.parse(JSONProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Omit<Product, 'quantity'>) => {
      // TODO ADD A NEW ITEM TO THE CART
      let productIsInCart = false;

      const productsToSave = products.map(prod => {
        if (prod.id === product.id) {
          productIsInCart = true;
          prod.quantity += 1;
        }
        return prod;
      });

      if (!productIsInCart) {
        productsToSave.push({
          ...product,
          quantity: 1,
        });
      }

      const json = JSON.stringify(productsToSave);
      await AsyncStorage.setItem('GoMarketplace:products', json);

      setProducts(productsToSave);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productsToSave = products.map(product => {
        if (product.id === id) {
          product.quantity += 1;
        }
        return product;
      });

      const json = JSON.stringify(productsToSave);
      await AsyncStorage.setItem('GoMarketplace:products', json);

      setProducts(productsToSave);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const decrementedProducts = products.map(product => {
        if (product.id === id) {
          product.quantity -= 1;
        }
        return product;
      });

      const productsToSave = decrementedProducts.filter(
        product => product.quantity > 0,
      );

      const json = JSON.stringify(productsToSave);
      await AsyncStorage.setItem('GoMarketplace:products', json);

      setProducts(productsToSave);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
