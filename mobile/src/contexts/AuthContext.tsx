import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface IProps {
  children: ReactNode;
}
interface IUser {
  name: string;
  avatarUrl: String;
}

export interface IAuthContext {
  user: IUser;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}
export const AuthContext = createContext({} as IAuthContext);
export function AuthContextProvider({ children }: IProps) {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [_request, response, proptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken)
      signInWithGoogle(response.authentication.accessToken);
  }, [response]);

  async function signIn() {
    try {
      setIsUserLoading(true);

      await proptAsync();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true);

      const response = await api.post("/user", { access_token });

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      const userInfoResponse = await api.get("/me");
      setUser(userInfoResponse.data);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isUserLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
