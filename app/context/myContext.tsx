import React, { createContext, useEffect, useState } from 'react';
import type {ReactNode} from 'react'
export const MyContext = createContext<any>(null);  

interface ContextProviderProps {
  children: ReactNode;  
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {  
  const test=99
    const [search,setSearch] = useState("")
    const [sortBy,setSortBy] = useState("")
    const [minAge, setMinAge] = useState(18)
    const [maxAge, setMaxAge] = useState(99)

    const [minSalary, setMinSalary] = useState(1)
    const [maxSalary, setMaxSalary] = useState(20)
    

  
  const value = {
    minAge,setMinAge,
    maxAge, setMaxAge,
    minSalary, setMinSalary,
    maxSalary, setMaxSalary,
    search,setSearch,sortBy,setSortBy
  };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};
