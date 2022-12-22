import { Center, Icon, Text } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { Button } from "../components/Button";
import Logo from "../assets/logo.svg";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
  const { signIn } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />
      <Button
        type="google"
        title="Entrar com o Google"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        mt={12}
        onPress={signIn}
      />
      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {"\n"}
        do seu email para criação da conta.
      </Text>
    </Center>
  );
}
