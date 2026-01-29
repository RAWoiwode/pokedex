import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface Pokemon {
  name: string;
  id: number;
  image: string;
}
export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  async function fetchPokemon() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=20",
      );
      const data = await response.json();

      // Fetch detailed info for each Pokemon in parallel
      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            id: pokemon.id,
            image: details.sprites.front_default, // main sprite
          };
        }),
      );

      // console.log(detailedPokemon);

      // console.log(data);
      setPokemon(detailedPokemon);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Fetch Pokemon
    fetchPokemon();
  }, []);

  return (
    <ScrollView>
      {pokemon.map((pokemon) => (
        <View key={pokemon.id}>
          <Text>{pokemon.name}</Text>
          <Image
            source={{ uri: pokemon.image }}
            style={{ width: 100, height: 100 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
