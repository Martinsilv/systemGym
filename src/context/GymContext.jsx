import { createContext, useContext, useState } from "react";

// Este context guarda configuración del gimnasio
// (nombre, logo, etc.)
const GymContext = createContext();

export function GymProvider({ children }) {
  const [gymConfig, setGymConfig] = useState(() => {
    const saved = localStorage.getItem("gym-config");
    return saved
      ? JSON.parse(saved)
      : {
          nombre: "MONKEY ATHLETICS",
          logo: null, // URL o base64 del logo
        };
  });

  const updateConfig = (newConfig) => {
    const updated = { ...gymConfig, ...newConfig };
    setGymConfig(updated);
    localStorage.setItem("gym-config", JSON.stringify(updated));
  };

  return (
    <GymContext.Provider value={{ gymConfig, updateConfig }}>
      {children}
    </GymContext.Provider>
  );
}

export const useGym = () => useContext(GymContext);
