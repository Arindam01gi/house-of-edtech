import HomeHeader from "@/components/home/HomeHeader";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
    ActivityIndicator,
    Dimensions, Animated,
    ImageBackground,
    Pressable,
    View,
} from "react-native";
import { useHeroMovies } from "@/hooks/useHeroMovies";
import { useState, useRef } from "react";
import { AppText } from "@/components/ui/AppText";
import { Movie } from "@/types/movie";

const HERO_HEIGHT = 620;

function BookmarkButton() {
  const [added, setAdded] = useState(false);
  
  return (
    <Pressable
      onPress={() => setAdded(!added)}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.92 : 1 }] },
        added 
          ? { backgroundColor: 'rgba(79, 140, 255, 0.20)', borderColor: '#4F8CFF' }
          : { backgroundColor: 'rgba(255, 255, 255, 0.10)', borderColor: 'rgba(255, 255, 255, 0.20)' }
      ]}
      className="h-14 w-14 items-center justify-center rounded-2xl border"
    >
      <Ionicons
        name={added ? "checkmark" : "add"}
        size={24}
        color={added ? "#4F8CFF" : "white"}
      />
    </Pressable>
  );
}

export default function HeroSection() {
    const { data, isLoading, error, refetch } = useHeroMovies();
    const scrollX = useRef(new Animated.Value(0)).current;

    if (isLoading) {
        return (
            <View 
              style={{ height: HERO_HEIGHT }} 
              className="items-center justify-center bg-[#0B0B0F]"
            >
                <ActivityIndicator size="large" color="#4F8CFF" />
                <AppText className="mt-4 text-zinc-500 font-medium">Loading movies...</AppText>
            </View>
        );
    }

    if (error || !data?.length) {
        return (
            <View 
              style={{ height: HERO_HEIGHT }} 
              className="items-center justify-center px-6 bg-[#0B0B0F]"
            >
                <Ionicons name="alert-circle-outline" size={54} color="#EF4444" />
                <AppText className="mt-4 text-center text-lg font-semibold text-zinc-200">
                    Failed to load featured movies
                </AppText>
                <AppText className="mt-2 text-center text-sm text-zinc-500 leading-5">
                    Please check your network settings and try again.
                </AppText>
                <Pressable 
                  onPress={() => refetch()}
                  style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.96 : 1 }] }]}
                  className="mt-6 px-6 py-3 rounded-xl bg-white/10 border border-white/20 active:bg-white/20"
                >
                  <AppText className="font-semibold text-white">Retry</AppText>
                </Pressable>
            </View>
        );
    }

    const movies = data.slice(0, 5);
    const { width } = Dimensions.get("window");

    return (
      <View style={{ height: HERO_HEIGHT }} className="relative">
        {/* Immersive Top Header */}
        <View className="absolute top-0 left-0 right-0 z-20">
          <HomeHeader />
        </View>

        {/* Top Overlay Gradient for Header readability */}
        <LinearGradient
          colors={["rgba(11, 11, 15, 0.9)", "rgba(11, 11, 15, 0)"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 160, zIndex: 10 }}
          pointerEvents="none"
        />

        <Animated.FlatList
          data={movies}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: Movie) => item.id.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={({ item }: { item: Movie }) => {
            const releaseYear = item.releaseDate ? item.releaseDate.split("-")[0] : "";
            return (
              <ImageBackground
                source={{ uri: item.backdrop }}
                resizeMode="cover"
                style={{ width, height: HERO_HEIGHT }}
              >
                <LinearGradient
                  colors={[
                    "rgba(11, 11, 15, 0.15)",
                    "rgba(11, 11, 15, 0.45)",
                    "rgba(11, 11, 15, 0.80)",
                    "#0B0B0F",
                  ]}
                  locations={[0, 0.40, 0.75, 1]}
                  className="flex-1 justify-end"
                >
                  <View className="px-6 pb-20">
                    {/* Badge Category Tag */}
                    <View className="mb-3 self-start rounded-full bg-[#4F8CFF]/25 border border-[#4F8CFF]/45 px-3 py-1">
                      <AppText className="text-[10px] font-bold text-[#4F8CFF] uppercase tracking-widest">
                        Masterclass
                      </AppText>
                    </View>

                    {/* Title */}
                    <AppText
                      variant="h1"
                      className="text-white font-extrabold"
                      style={{ fontSize: 32, lineHeight: 40 }}
                      numberOfLines={2}
                    >
                      {item.title}
                    </AppText>

                    {/* Metadata Row */}
                    <View className="mt-3 flex-row items-center gap-2">
                      <Ionicons
                        name="star"
                        size={15}
                        color="#FFC107"
                      />

                      <AppText className="font-bold text-yellow-500 text-sm">
                        {item.rating.toFixed(1)}
                      </AppText>

                      <View className="h-1 w-1 rounded-full bg-zinc-500" />

                      <AppText className="text-zinc-300 text-sm font-medium">
                        {releaseYear}
                      </AppText>

                      <View className="h-1 w-1 rounded-full bg-zinc-500" />

                      <AppText className="text-zinc-300 text-sm font-medium">
                        90 mins
                      </AppText>
                    </View>

                    {/* Overview description */}
                    <AppText
                      variant="bodySmall"
                      className="mt-3 text-zinc-400 leading-5"
                      numberOfLines={2}
                    >
                      {item.overview}
                    </AppText>

                    {/* Action buttons */}
                    <View className="mt-6 flex-row items-center gap-3">
                      <Pressable 
                        style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.96 : 1 }] }]}
                        className="flex-1 h-14 flex-row items-center justify-center rounded-2xl bg-white shadow-lg active:opacity-90"
                      >
                        <Ionicons
                          name="play"
                          size={18}
                          color="black"
                        />

                        <AppText style={{ color: "black", fontFamily: "InterBold" }} className="ml-2 text-base">
                          Watch Now
                        </AppText>
                      </Pressable>

                      <BookmarkButton />
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            );
          }}
        />

        {/* Fixed Pagination Dots Indicator */}
        <View className="absolute bottom-6 left-0 right-0 z-20 flex-row justify-center">
          {movies.map((_: any, index: number) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });

            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [0.4, 1, 0.4],
              extrapolate: "clamp",
            });

            const dotColor = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: ["rgba(255,255,255,0.4)", "#4F8CFF", "rgba(255,255,255,0.4)"],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={{
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: dotColor,
                }}
                className="mx-1 h-1.5 rounded-full"
              />
            );
          })}
        </View>
      </View>
    );
}
