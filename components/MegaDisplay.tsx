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
          flexDirection: "row",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 28 }}>MEGA</Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 28 }}>X</Text>
          <Switch
            onValueChange={onBasePress}
            value={isMegaBase}
            ios_backgroundColor={"black"}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 28 }}>Y</Text>
          <Switch
            onValueChange={onAlternatePress}
            value={isMegaAlternate}
            ios_backgroundColor={"black"}
          />
        </View>
      </View>
    );
  } else {
    display = (
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          marginHorizontal: "auto",
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 28 }}>MEGA</Text>
        <Switch
          onValueChange={onBasePress}
          value={isMegaBase}
          ios_backgroundColor={"black"}
        />
      </View>
    );
  }

  return display;
};

export default MegaDisplay;
