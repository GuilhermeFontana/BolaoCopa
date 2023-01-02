import { useNavigation } from "@react-navigation/native";
import { Row, Text } from "native-base";

export function EmptyGameList() {
  return (
    <Row flexWrap="wrap" justifyContent="center">
      <Text color="white" fontSize="sm" textAlign="center">
        Ainda não existe nenhum jogo aqui
      </Text>
    </Row>
  );
}
