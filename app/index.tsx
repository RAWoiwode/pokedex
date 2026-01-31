import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface Pokemon {
  name: string;
  id: number;
  image: string;
  types: PokemonType[];
  url: string;
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  grass: "#00cc00",
  fire: "#ee8f36",
  water: "#0a19eb",
  bug: "#3af53a",
};

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
            id: details.id,
            types: details.types,
            image: details.sprites.front_default, // main sprite
            url: pokemon.url,
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
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      {pokemon.map((pokemon) => (
        <Link
          href={{
            pathname: "/details",
            params: { name: pokemon.name, url: pokemon.url },
          }}
          key={pokemon.id}
        >
          <View
            style={{
              backgroundColor: colorsByType[pokemon.types[0].type.name] + 30,
              padding: 20,
              borderRadius: 20,
            }}
          >
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                source={{ uri: pokemon.image }}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
});
