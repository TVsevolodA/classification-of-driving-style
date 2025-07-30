"use client";

import { createContext, useContext } from "react";
import { User } from "../models/user";

export const UserContext = createContext(null);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context.user;
}

export function UserContextProvider({ user, children }: { user: User; children: React.ReactNode }) {
    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}