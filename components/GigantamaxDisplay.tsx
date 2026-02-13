import { Switch, Text, View } from "react-native";

interface Props {
  isGigantamax: boolean;
  onGMaxPress: () => void;
}

const GigantamaxDisplay = ({
  isGigantamax,
  onGMaxPress: onGigantamaxPress,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginHorizontal: "auto",
      }}
    >
      <Text style={{ textAlign: "center", fontSize: 28 }}>GMAX</Text>
      <Switch
        onValueChange={onGigantamaxPress}
        value={isGigantamax}
        ios_backgroundColor={"black"}
      />
    </View>
  );
};

export default GigantamaxDisplay;
