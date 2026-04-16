import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
  const [data, setData] = useState({
    personal: {},
    job: {},
    experience: [],
    documents: {},
    bgv: {}
  });

  const updateSection = (section, value) => {
    setData(prev => ({ ...prev, [section]: value }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateSection }}>
      {children}
    </OnboardingContext.Provider>
  );
};
