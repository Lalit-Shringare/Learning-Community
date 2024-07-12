import { useState } from "react";
import { createContext } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [data, setdata] = useState(null);

    return(
        <ProfileContext.Provider value={{data, setdata}}>
            {children}
        </ProfileContext.Provider>
    )
}