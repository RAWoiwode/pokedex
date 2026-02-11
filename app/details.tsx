import MegaDisplay from "@/components/MegaDisplay";
import { COLORS_BY_TYPE } from "@/constants/colorsByType";
import { GIGANTAMAX_POKEMON } from "@/constants/gigantamaxList";
import { MEGA_POKEMON } from "@/constants/megaList";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Switch, Text, View } from "react-native";

interface PokemonDetails {
  id: number;
  type1: string;
  type2: string | null;
  front_sprite: string;
  front_shiny_sprite: string;
  mega: number | undefined;
  mega_front_sprite?: string | null;
  mega_front_shiny_sprite?: string | null;
  mega_front_sprite_2?: string | null;
  mega_front_shiny_sprite_2?: string | null;
  gmax_front_sprite?: string | null;
  gmax_front_shiny_sprite?: string | null;
}
export default function Details() {
  const { name, url } = useLocalSearchParams();

  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null,
  );
  const [isShiny, setIsShiny] = useState(false);
  const [isMegaBase, setIsMegaBase] = useState(false);
  const [isMegaAlternate, setIsMegaAlternate] = useState(false);
  const [isGigantamax, setIsGigantamax] = useState(false);

  let imageURI = "";

  useEffect(() => {
    fetchPokemonDetailsByUrl(url as string);
  }, [url]);

  async function fetchPokemonDetailsByUrl(url: string) {
    try {
      // Fetch details
      const response = await fetch(url);
      const data = await response.json();

      // console.log(data);
      const megaInfo = {
        mega: MEGA_POKEMON.get(data.name),
        mega_front_sprite: null,
        mega_front_shiny_sprite: null,
        mega_front_sprite_2: null,
        mega_front_shiny_sprite_2: null,
      };

      switch (megaInfo.mega) {
        case 1:
          const megaResponse = await fetch(
            "https://pokeapi.co/api/v2/pokemon-form/" + data.name + "-mega",
          );
          const megaData = await megaResponse.json();
          megaInfo.mega_front_sprite = megaData.sprites.front_default;
          megaInfo.mega_front_shiny_sprite = megaData.sprites.front_shiny;
          break;
        case 2:
          switch (data.name) {
            case "charizard":
            case "mewtwo":
            case "raichu":
              const megaXResponse = await fetch(
                "https://pokeapi.co/api/v2/pokemon-form/" +
                  data.name +
                  "-mega-x",
              );
              const megaXData = await megaXResponse.json();
              megaInfo.mega_front_sprite = megaXData.sprites.front_default;
              megaInfo.mega_front_shiny_sprite = megaXData.sprites.front_shiny;

              const megaYResponse = await fetch(
                "https://pokeapi.co/api/v2/pokemon-form/" +
                  data.name +
                  "-mega-y",
              );
              const megaYData = await megaYResponse.json();
              megaInfo.mega_front_sprite_2 = megaYData.sprites.front_default;
              megaInfo.mega_front_shiny_sprite_2 =
                megaYData.sprites.front_shiny;
              break;
          }
      }

      const gmaxInfo = {
        gmax: GIGANTAMAX_POKEMON.includes(data.name),
        gmax_front_sprite: null,
        gmax_front_shiny_sprite: null,
      };

      if (gmaxInfo.gmax) {
        const gmaxResponse = await fetch(
          "https://pokeapi.co/api/v2/pokemon-form/" + data.name + "-gmax",
        );
        const gmaxData = await gmaxResponse.json();
        gmaxInfo.gmax_front_sprite = gmaxData.sprites.front_default;
        gmaxInfo.gmax_front_shiny_sprite = gmaxData.sprites.front_shiny;
      }

      const details = {
        id: data.id,
        type1: data.types[0].type.name,
        type2: data.types[1] ? data.types[1].type.name : null,
        front_sprite: data.sprites.front_default,
        front_shiny_sprite: data.sprites.front_shiny,
        ...megaInfo,
        ...gmaxInfo,
      };

      setPokemonDetails(details);
      console.log(details);
    } catch (error) {
      console.log(error);
    }
  }

  const onShinyPress = () => {
    setIsShiny(!isShiny);
  };

  const onMegaBasePress = () => {
    setIsMegaBase((prev) => {
      if (!prev) {
        setIsMegaAlternate(false);
      }
      return !prev;
    });
  };

  const onMegaAlternatePress = () => {
    setIsMegaAlternate((prev) => {
      if (!prev) {
        setIsMegaBase(false);
      }
      return !prev;
    });
  };

  // Form Check Logic
  if (pokemonDetails) {
    if (isMegaBase) {
      if (isShiny) {
        imageURI = pokemonDetails.mega_front_shiny_sprite ?? "";
      } else {
        imageURI = pokemonDetails.mega_front_sprite ?? "";
      }
    } else if (isMegaAlternate) {
      if (isShiny) {
        imageURI = pokemonDetails.mega_front_shiny_sprite_2 ?? "";
      } else {
        imageURI = pokemonDetails.mega_front_sprite_2 ?? "";
      }
    } else if (isGigantamax) {
      if (isShiny) {
        imageURI = pokemonDetails.gmax_front_shiny_sprite ?? "";
      } else {
        imageURI = pokemonDetails.gmax_front_sprite ?? "";
      }
    } else {
      imageURI = isShiny
        ? (pokemonDetails.front_shiny_sprite ?? "")
        : (pokemonDetails.front_sprite ?? "");
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
          width: "auto",
          textAlign: "center",
          paddingRight: 16,
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
          headerStyle: {
            backgroundColor: pokemonDetails
              ? COLORS_BY_TYPE[pokemonDetails.type1]
              : COLORS_BY_TYPE["normal"],
          },
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
                  flex: 1,
                  fontSize: 20,
                  textTransform: "uppercase",
                  textAlign: "center",
                  fontWeight: "bold",
                  backgroundColor: COLORS_BY_TYPE[pokemonDetails.type1],
                  paddingVertical: 4,
                }}
              >
                {pokemonDetails.type1}
              </Text>
              {pokemonDetails.type2 && (
                <Text
                  style={{
                    width: "50%",
                    flex: 1,
                    fontSize: 20,
                    textTransform: "uppercase",
                    textAlign: "center",
                    fontWeight: "bold",
                    backgroundColor: COLORS_BY_TYPE[pokemonDetails.type2],
                    paddingVertical: 4,
                  }}
                >
                  {pokemonDetails.type2}
                </Text>
              )}
            </View>
            <View
              style={{
                alignItems: "center",
                backgroundColor: COLORS_BY_TYPE[pokemonDetails.type1] + 33,
              }}
            >
              <Image
                source={{ uri: imageURI }}
                style={{
                  borderRadius: 8,
                  height: 256,
                  width: 256,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginHorizontal: "auto",
              }}
            >
              <Switch
                onValueChange={onShinyPress}
                value={isShiny}
                ios_backgroundColor={"black"}
              />
              <Text style={{ textAlign: "center", fontSize: 28 }}>Shiny</Text>
            </View>
            {pokemonDetails.mega && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: "pink",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 32,
                  }}
                >
                  Forms
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
              }}
            >
              {pokemonDetails.mega && (
                <MegaDisplay
                  megaCount={pokemonDetails.mega}
                  isMegaBase={isMegaBase}
                  isMegaAlternate={isMegaAlternate}
                  onBasePress={onMegaBasePress}
                  onAlternatePress={onMegaAlternatePress}
                />
              )}
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </>
  );
}
