import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { SessionUser } from "@petcircle/contracts";
import { apiGet } from "../../shared/api/query/query";

type SessionValue = {
  user: SessionUser | null;
  loading: boolean;
  setUser: (user: SessionUser | null) => void;
};

const SessionContext = createContext<SessionValue>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<SessionUser>("/auth/me")
      .then((result) => setUser(result.ok ? result.data : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
