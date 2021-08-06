import React, { createContext, useState } from "react";

export const ResponseContext = createContext();

// This context provider is passed to any component requiring the context
export function ResponseProvider({ children }) {
  const [response, setResponse] = useState("");

  return (
    <ResponseContext.Provider value={{response,setResponse}}>
      {children}
    </ResponseContext.Provider>
  );
};
