import { COLORS_BY_TYPE } from "@/constants/colorsByType";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface PokemonDetails {
  id: number;
  type1: string;
  type2: string | null;
  front_sprite: string;
  front_shiny_sprite: string;
}
export default function Details() {
  const { name, url } = useLocalSearchParams();

  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null,
  );

  useEffect(() => {
    fetchPokemonDetailsByUrl(url as string);
  }, [url]);

  async function fetchPokemonDetailsByUrl(url: string) {
    try {
      // Fetch details
      const response = await fetch(url);
      const data = await response.json();

      // console.log(data);
      const details = {
        id: data.id,
        type1: data.types[0].type.name,
        type2: data.types[1] ? data.types[1].type.name : null,
        front_sprite: data.sprites.front_default,
        front_shiny_sprite: data.sprites.front_shiny,
      };

      setPokemonDetails(details);
    } catch (error) {
      console.log(error);
    }
  }

  const headerDisplay = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          backgroundColor: "gray",
          width: "25%",
          textAlign: "center",
        }}
      >
        {pokemonDetails?.id}
      </Text>
      <Text
        style={{
          flex: 1,
          textTransform: "capitalize",
          fontSize: 28,
          fontWeight: "bold",
          backgroundColor: "red",
        }}
      >
        {name}
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: name as string,
          headerTitle: () => headerDisplay,
        }}
      />
      <ScrollView
        contentContainerStyle={{
          gap: 16,
        }}
      >
        {pokemonDetails ? (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                flex: 1,
                paddingHorizontal: 0,
              }}
            >
              <Text
                style={{
                  width: "50%",
                  fontSize: 20,
                  textTransform: "uppercase",
                  textAlign: "center",
                  backgroundColor: COLORS_BY_TYPE[pokemonDetails.type1] + 75,
                  paddingVertical: 4,
                }}
              >
                {pokemonDetails.type1}
              </Text>
              {pokemonDetails.type2 ? (
                <Text
                  style={{
                    width: "50%",
                    fontSize: 20,
                    textTransform: "uppercase",
                    textAlign: "center",
                    backgroundColor: COLORS_BY_TYPE[pokemonDetails.type2] + 75,
                    paddingVertical: 4,
                  }}
                >
                  {pokemonDetails.type2}
                </Text>
              ) : null}
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <Image
                source={{ uri: pokemonDetails.front_sprite }}
                style={{
                  height: 175,
                  width: 175,
                  backgroundColor: COLORS_BY_TYPE[pokemonDetails.type1] + 33,
                  borderRadius: 8,
                }}
              />
              <Image
                source={{ uri: pokemonDetails.front_shiny_sprite }}
                style={{
                  height: 175,
                  width: 175,
                  backgroundColor: COLORS_BY_TYPE[pokemonDetails.type1] + 33,
                  borderRadius: 8,
                }}
              />
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
