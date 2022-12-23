import { NativeBaseProvider, StatusBar } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { THEME } from "./src/styles/theme";
import { Loading } from "./src/components/Loading";
import { Polls } from "./src/screens/Polls";

export default function App() {
  const [fonts] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fonts ? <Polls /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
