import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

interface PokemonDetails {
  id: number;
  height: number;
  weight: number;
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
        height: data.height,
        weight: data.weight,
      };

      setPokemonDetails(details);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: name as string,
          headerTitle: () => (
            <Text
              style={{
                textTransform: "capitalize",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {name}
            </Text>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
        }}
      >
        {pokemonDetails ? (
          <>
            <Text>ID # {pokemonDetails.id}</Text>
            <Text>Height: {pokemonDetails.height}</Text>
            <Text>Height: {pokemonDetails.weight}</Text>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
