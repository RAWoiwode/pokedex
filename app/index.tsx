import { COLORS_BY_TYPE } from "@/constants/colorsByType";
import { GIGANTAMAX_POKEMON_IDS } from "@/constants/gigantamaxList";
import { MEGA_POKEMON_IDS } from "@/constants/megaList";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// TODO: Figure out where the bottom border of 1px b/w modal header and body comes from
interface Pokemon {
  name: string;
  id: number;
  image: string;
  types: PokemonType[];
  url: string;
  mega: boolean;
  gmax: boolean;
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface PokemonListItem {
  name: string;
  url: string;
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

const normalizePokemonName = (name: string, id: number): string => {
  if (!name.includes("-")) return name;

  if ([1001, 1002, 1003, 1004].includes(id)) return name; // Treasures of Ruin Pokemon

  const splitName = name.split("-");
  let result = splitName[0];

  if (id > 983) {
    result = splitName[0] + " " + splitName[1];
  }

  return result;
};

export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Flag to see if we need to fetch again

  const { width } = useWindowDimensions();
  const COLUMN_GAP = 12;
  const HORIZONTAL_PADDING = 12;
  const CARD_WIDTH =
    Platform.OS === "web"
      ? undefined
      : (width - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

  const fetchPokemon = useCallback(async () => {
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
      const results: PokemonListItem[] = Array.isArray(data.results)
        ? data.results
        : [];

      const detailedPokemonPage = results
        .map((pokemon) => {
          const id = pokemon.url.split("/").filter(Boolean).pop();
          if (!id) return null;

          const numeric_id = Number(id);

          // Work on hypenated names
          const pokemonName = normalizePokemonName(pokemon.name, numeric_id);

          return {
            name: pokemonName,
            id: numeric_id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            types: [] as PokemonType[],
            url: pokemon.url,
            mega: MEGA_POKEMON_IDS.includes(numeric_id),
            gmax: GIGANTAMAX_POKEMON_IDS.includes(numeric_id),
          };
        })
        // Only 1025 official pokemon currently
        .filter((p): p is Pokemon => p !== null && p.id <= 1025);

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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoading, isLoadingMore, offset]);

  useEffect(() => {
    // Fetch Pokemon
    fetchPokemon();
  }, [fetchPokemon]);

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
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => {
        const typeName = item.types?.[0]?.type?.name ?? "normal";
        const bg = COLORS_BY_TYPE[typeName] ?? COLORS_BY_TYPE.normal;

        return (
          <Link
            href={{
              pathname: "/details",
              params: { name: item.name, url: item.url },
            }}
            asChild
          >
            <Pressable
              style={StyleSheet.flatten([
                styles.card,
                { backgroundColor: bg },
                CARD_WIDTH ? { width: CARD_WIDTH } : null,
              ])}
            >
              <Text style={styles.name}>{item.name}</Text>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.sprite} />
              ) : (
                <ActivityIndicator />
              )}
              <View style={styles.badges}>
                {item.mega && (
                  <Image
                    source={require("../assets/icons/MegaEvolutionIcon.webp")}
                    style={{ width: 32, height: 32 }}
                  />
                )}
                {item.gmax && (
                  <Image
                    source={require("../assets/icons/GigantamaxIcon.webp")}
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#00000044",
                    }}
                  />
                )}
              </View>
            </Pressable>
          </Link>
        );
      }}
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
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    marginBottom: 12,
    marginHorizontal: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    ...(Platform.OS === "web" ? { flex: 1 } : null),
  },
  sprite: {
    width: 150,
    height: 150,
  },
  badges: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
