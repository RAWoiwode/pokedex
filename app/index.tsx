import { COLORS_BY_TYPE } from "@/constants/colorsByType";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

// TODO: Figure out where the bottom border of 1px b/w modal header and body comes from
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

const LIMIT = 20;

const fetchPokemonDetails = async (url: string): Promise<PokemonType[]> => {
  try {
    const result = await fetch(url);
    const details = await result.json();
    return details.types;
  } catch {
    return [];
  }
};

export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Flag to see if we need to fetch again

  async function fetchPokemon() {
    // If we have nothing more to fetch, return
    if (!hasMore || isLoading || isLoadingMore) return;

    try {
      if (offset === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Fetch so many pokemon per "page"
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${LIMIT}&offset=${offset}`,
      );
      const data = await response.json();

      const detailedPokemonPage = data.results
        .map((pokemon: any) => {
          const id = pokemon.url.split("/").filter(Boolean).pop();

          if (offset === 680) console.log(data);
          return {
            name: pokemon.name,
            id: Number(id),
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            types: [],
            url: pokemon.url,
          };
        })
        // Only 1025 official pokemon currently
        .filter((pokemon: Pokemon) => pokemon.id <= 1025);

      // Fetch types for all items on this page
      const withTypes = await Promise.all(
        detailedPokemonPage.map(async (pokemon: Pokemon) => {
          const types = await fetchPokemonDetails(pokemon.url);
          return { ...pokemon, types };
        }),
      );

      setPokemon((prev) => [...prev, ...withTypes]); // Add next page of Pokemon
      setOffset((prev) => prev + LIMIT); // Increase offset
      setHasMore(detailedPokemonPage.length === LIMIT);

      // prefetch images for current page (silently ignores failures)
      const uris = detailedPokemonPage
        .map((pokemon: Pokemon) => pokemon.image)
        .filter(Boolean);
      Promise.allSettled(uris.map((uri: string) => Image.prefetch(uri))).catch(
        () => {},
      );

      // INITIAL WAY OF FETCHING -- Fetch detailed info for each Pokemon in parallel
      // const detailedPokemon = await Promise.all(
      //   data.results.map(async (pokemon: any) => {
      //     const res = await fetch(pokemon.url);
      //     const details = await res.json();

      //     return {
      //       name: pokemon.name,
      //       id: details.id,
      //       types: details.types,
      //       image: details.sprites.front_default, // main sprite
      //       url: "https://pokeapi.co/api/v2/pokemon-form/" + details.id,
      //     };
      //   }),
      // );

      // console.log(detailedPokemon);

      // console.log(data);
      // setPokemon(detailedPokemonPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    // Fetch Pokemon
    fetchPokemon();
  });

  if (isLoading && pokemon.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  // TODO: Convert to FlatList
  return (
    <FlatList
      data={pokemon}
      keyExtractor={(pokemon) => String(pokemon.id)}
      numColumns={2}
      contentContainerStyle={{
        marginHorizontal: "auto",
        gap: 12,
        backgroundColor: "black",
      }}
      columnWrapperStyle={{
        gap: 12,
      }}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/details",
            params: { name: item.name, url: item.url },
          }}
        >
          <View
            style={{
              backgroundColor:
                COLORS_BY_TYPE[item.types?.[0]?.type?.name ?? "normal"],
              padding: 20,
              borderRadius: 20,
              flex: 1,
            }}
          >
            <Text style={styles.name}>{item.name}</Text>

            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={{ width: 150, height: 150 }}
              />
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </Link>
      )}
      onEndReached={() => {
        if (!isLoadingMore && hasMore) fetchPokemon();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isLoadingMore ? <ActivityIndicator /> : null}
      initialNumToRender={20}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
  },
});
