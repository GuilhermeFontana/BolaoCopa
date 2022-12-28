import { useState } from "react";
import { Heading, useToast, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const { navigate } = useNavigation();
  const toast = useToast();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (!code.trim())
        toast.show({
          title: "Informe o código do bolão",
          placement: "top",
          bgColor: "red.500",
        });

      await api.post(`/poll/${code.toUpperCase()}/join`);
      toast.show({
        title: "Agora você também faz parte deste bolão",
        placement: "top",
        bgColor: "green.500",
      });
      setCode("");
      setIsLoading(false);
      navigate("polls");
    } catch (err) {
      setIsLoading(false);

      console.log(err);

      const title =
        err.response?.data.message || "Não foi possível encontrar no bolão!";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          color="white"
          fontFamily="heading"
          fontSize="xl"
          textAlign="center"
          mb={8}
        >
          Encontrar um bolão através {"\n"} de seu código único.
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          value={code}
          autoCapitalize="characters"
          onChangeText={setCode}
        />
        <Button
          title="Buscar bolão"
          isLoading={false}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  );
}
