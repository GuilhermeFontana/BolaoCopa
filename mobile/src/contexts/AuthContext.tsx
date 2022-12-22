import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

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

  const [request, response, proptAsync] = Google.useAuthRequest({
    clientId:
      "281185258894-sct1rovtj96r7ijphra7u60i1n53092h.apps.googleusercontent.com",
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

  async function signInWithGoogle(accessToken: string) {
    console.log(accessToken);
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
