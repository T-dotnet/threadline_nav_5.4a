import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { DEMO_SECONDARY_USERS } from "../lib/demoWorkspace";

export type AccessLevel = "full" | "partial";

export interface SecondaryUser {
  id: string;
  name: string;
  role: string;
  email: string;
  access: AccessLevel;
}

export const SECONDARY_USER_ROLES = ["Partner", "Teacher", "Family member", "Carer"];

interface SecondaryUsersContextType {
  secondaryUsers: SecondaryUser[];
  addSecondaryUser: (user: Omit<SecondaryUser, "id">) => void;
  removeSecondaryUser: (id: string) => void;
  setSecondaryUserAccess: (id: string, access: AccessLevel) => void;
}

const INITIAL_SECONDARY_USERS: SecondaryUser[] = DEMO_SECONDARY_USERS;

const SECONDARY_USERS_STORAGE_KEY = "threadline-secondary-users";

function readStoredSecondaryUsers(): SecondaryUser[] {
  try {
    const stored = localStorage.getItem(SECONDARY_USERS_STORAGE_KEY);
    if (!stored) return INITIAL_SECONDARY_USERS;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : INITIAL_SECONDARY_USERS;
  } catch {
    return INITIAL_SECONDARY_USERS;
  }
}

const SecondaryUsersContext = createContext<SecondaryUsersContextType | undefined>(undefined);

export function SecondaryUsersProvider({ children }: { children: ReactNode }) {
  const [secondaryUsers, setSecondaryUsers] = useState<SecondaryUser[]>(readStoredSecondaryUsers);

  useEffect(() => {
    try {
      localStorage.setItem(SECONDARY_USERS_STORAGE_KEY, JSON.stringify(secondaryUsers));
    } catch {
      // Storage can be unavailable in restricted contexts; in-memory state still works.
    }
  }, [secondaryUsers]);

  const addSecondaryUser = useCallback((user: Omit<SecondaryUser, "id">) => {
    setSecondaryUsers((prev) => [
      ...prev,
      { ...user, id: `su-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
    ]);
  }, []);

  const removeSecondaryUser = useCallback((id: string) => {
    setSecondaryUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const setSecondaryUserAccess = useCallback((id: string, access: AccessLevel) => {
    setSecondaryUsers((prev) => prev.map((u) => (u.id === id ? { ...u, access } : u)));
  }, []);

  const value = React.useMemo(
    () => ({ secondaryUsers, addSecondaryUser, removeSecondaryUser, setSecondaryUserAccess }),
    [secondaryUsers, addSecondaryUser, removeSecondaryUser, setSecondaryUserAccess],
  );

  return (
    <SecondaryUsersContext.Provider value={value}>
      {children}
    </SecondaryUsersContext.Provider>
  );
}

export function useSecondaryUsers() {
  const context = useContext(SecondaryUsersContext);
  if (!context) {
    throw new Error("useSecondaryUsers must be used within a SecondaryUsersProvider");
  }
  return context;
}
