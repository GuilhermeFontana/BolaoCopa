import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

interface Props extends IButtonProps {
  title: string;
  type?: "primary" | "google";
  uppercase?: Boolean;
}

export function Button({ title, type = "primary", uppercase = true, ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={type === "google" ? "red.500" : "yellow.500"}
      _pressed={{
        bg: type === "google" ? "red.400" : "yellow.600",
      }}
      _loading={{
        _spinner: { color: "black" },
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={type === "google" ? "white" : "black"}
        textTransform={!uppercase ? "none" : "uppercase"}
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
