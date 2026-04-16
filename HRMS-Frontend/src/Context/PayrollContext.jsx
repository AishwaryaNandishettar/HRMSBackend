import { createContext, useState , useEffect} from "react";

export const PayrollContext = createContext();

export const PayrollProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPayroll = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
  const interval = setInterval(() => {
    setRefreshKey(prev => prev + 1);
  }, 30000); // every 30 sec

  return () => clearInterval(interval);
}, []);
  return (
    <PayrollContext.Provider value={{ refreshKey, refreshPayroll }}>
      {children}
    </PayrollContext.Provider>
  );
};