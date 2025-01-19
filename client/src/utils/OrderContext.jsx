import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const updateOrders = (newOrders) => setOrders(newOrders);

  return (
    <OrderContext.Provider value={{ orders, updateOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
