import axios from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserWithStats } from "../interfaces/Common.interface";

interface IAuthContext {
  userCredentials: { user: UserWithStats | null; token: string | null };
  setUserCredentials: Dispatch<
    SetStateAction<{ user: UserWithStats | null; token: string | null }>
  >;
  status: "loading" | "authenticated" | "unauthenticated";
  setStatus: Dispatch<
    SetStateAction<"loading" | "authenticated" | "unauthenticated">
  >;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userCredentials, setUserCredentials] = useState<{
    user: UserWithStats | null;
    token: string | null;
  }>({
    user: null,
    token: null,
  });
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    if (userCredentials.token && userCredentials.user) {
      localStorage.setItem("user", JSON.stringify(userCredentials.user));
      localStorage.setItem("token", userCredentials.token);
      axios.defaults.headers.common["authorization"] = userCredentials.token;
      setStatus("authenticated");
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      axios.defaults.headers.common["authorization"] = false;
      setStatus("unauthenticated");
    }
  }, [userCredentials]);

  function logout(callback?: () => void) {
    setUserCredentials({ user: null, token: null });
    if (callback) callback();
  }

  return (
    <AuthContext.Provider
      value={{ userCredentials, setUserCredentials, status, setStatus, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
