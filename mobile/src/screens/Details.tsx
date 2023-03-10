import { useState, useEffect } from "react";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollPros } from "../components/PollCard";
import { PollHeader } from "../components/PollHeader";
import { EmptyMyPollList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";
import { EmptyRakingList } from "../components/EmptyRakingList";

interface IRouteParams {
  id: string;
}

export function Details() {
  const [pollDetails, setPollDetails] = useState<PollPros>({} as PollPros);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "rancking">(
    "guesses"
  );
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { id } = route.params as IRouteParams;
  const toast = useToast();

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/poll/${id}`);

      setPollDetails(response.data);
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível carregar as informações do bolão!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: `Venha participar do bolão comigo. O código é: ${pollDetails.code}`,
    });
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bg="gray.900">
      <Header
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {pollDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PollHeader data={pollDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Rancking do grupo"
              isSelected={optionSelected === "rancking"}
              onPress={() => setOptionSelected("rancking")}
            />
          </HStack>
          {optionSelected === "guesses" ? (
            <Guesses pollId={pollDetails.id} />
          ) : (
            <EmptyRakingList />
          )}
        </VStack>
      ) : (
        <EmptyMyPollList code={pollDetails.code} />
      )}
    </VStack>
  );
}
