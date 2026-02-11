import React from "react";
import { Switch, Text, View } from "react-native";

interface Props {
  megaCount: number;
  isMegaBase: boolean;
  isMegaAlternate: boolean;
  onBasePress: () => void;
  onAlternatePress: () => void;
}

const MegaDisplay = ({
  megaCount,
  isMegaBase,
  isMegaAlternate,
  onBasePress,
  onAlternatePress,
}: Props) => {
  let display;

  if (megaCount === 2) {
    display = (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          gap: 16,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Switch
            onValueChange={onBasePress}
            value={isMegaBase}
            ios_backgroundColor={"black"}
          />
          <Text style={{ textAlign: "center", fontSize: 28 }}>MEGA X</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Switch
            onValueChange={onAlternatePress}
            value={isMegaAlternate}
            ios_backgroundColor={"black"}
          />
          <Text style={{ textAlign: "center", fontSize: 28 }}>MEGA Y</Text>
        </View>
      </View>
    );
  } else {
    display = (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginHorizontal: "auto",
        }}
      >
        <Switch
          onValueChange={onBasePress}
          value={isMegaBase}
          ios_backgroundColor={"black"}
        />
        <Text style={{ textAlign: "center", fontSize: 28 }}>MEGA</Text>
      </View>
    );
  }

  return display;
};

export default MegaDisplay;
