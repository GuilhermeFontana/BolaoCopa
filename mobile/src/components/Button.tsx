import { Button as NativeButton, Text, IButtonProps } from "native-base";

interface IProps extends IButtonProps {
  title: String;
  type?: "default" | "google";
}

export function Button({ title, type = "default", ...rest }: IProps) {
  return (
    <NativeButton
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      bg={type === "google" ? "red.500" : "yellow.500"}
      _pressed={{
        bg: type === "google" ? "red.400" : "yellow.400",
      }}
      _loading={{
        _spinner: { color: "black" },
      }}
      {...rest}
    >
      <Text
        textTransform="uppercase"
        color={type === "google" ? "white" : "black"}
        bold
        fontSize="sm"
        fontFamily="heading"
      >
        {title}
      </Text>
    </NativeButton>
  );
}
