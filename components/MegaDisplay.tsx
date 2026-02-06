import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  megaCount: number;
  onBasePress: () => void;
  onAlternatePress: () => void;
}

const MegaDisplay = ({ megaCount, onBasePress, onAlternatePress }: Props) => {
  let display;

  if (megaCount === 2) {
    display = (
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onBasePress}
          style={{
            borderColor: "black",
            borderWidth: 1,
            width: "50%",
            padding: 12,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 28 }}>MEGA X</Text>
        </Pressable>
        <Pressable
          onPress={onAlternatePress}
          style={{
            borderColor: "black",
            borderWidth: 1,
            width: "50%",
            padding: 12,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 28 }}>MEGA Y</Text>
        </Pressable>
      </View>
    );
  } else {
    display = (
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={onBasePress}
          style={{
            borderColor: "black",
            borderWidth: 1,
            width: "50%",
            padding: 12,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 28 }}>MEGA</Text>
        </Pressable>
      </View>
    );
  }

  return display;
};

export default MegaDisplay;
