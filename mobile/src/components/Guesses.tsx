import { useEffect, useState } from "react";
import { Box, FlatList, useToast } from "native-base";
import { api } from "../services/api";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";
import { EmptyGameList } from "./EmptyGameList";
interface Props {
  pollId: string;
}

export function Guesses({ pollId }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/poll/${pollId}/games`);
      setGames(response.data);
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível carregar os jogos!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints || !secondTeamPoints) {
        toast.show({
          title: "Informe o placar corretamente!",
          placement: "top",
          bgColor: "red.500",
        });

        return;
      }

      await api.post(`poll/${pollId}/game/${gameId}/guess`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite registrado!",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível enviar seu palpite!",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    fetchGames();
  }, [pollId]);

  return isLoading ? (
    <Loading />
  ) : (
    <FlatList
      data={games}
      keyExtractor={(Item) => Item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={handleGuessConfirm}
        />
      )}
      ListEmptyComponent={() => <EmptyGameList />}
    />
  );
}
