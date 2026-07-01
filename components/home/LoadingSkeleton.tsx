import { useAppTheme } from "@/providers/AppThemeProvider";
import React, { memo, useEffect, useRef } from "react";
import { Animated, View } from "react-native";

type Props = {
  variant?: "card" | "section" | "detail";
  count?: number;
};

function SkeletonBlock({
  className,
  style,
  color,
}: {
  className?: string;
  style?: object;
  color: string;
}) {
  return (
    <View className={className} style={[{ backgroundColor: color }, style]} />
  );
}

function LoadingSkeleton({ variant = "section", count = 4 }: Props) {
  const { colors, isDark } = useAppTheme();
  const opacity = useRef(new Animated.Value(0.45)).current;
  const blockColor = isDark ? "rgba(255,255,255,0.10)" : "#E6EAF2";

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  if (variant === "detail") {
    return (
      <Animated.View style={{ opacity }}>
        <SkeletonBlock color={blockColor} className="h-[420px] w-full" />
        <View className="px-5 pt-6">
          <SkeletonBlock color={blockColor} className="h-8 w-4/5 rounded-xl" />
          <SkeletonBlock
            color={blockColor}
            className="mt-3 h-4 w-2/3 rounded-xl"
          />
          <View className="mt-5 flex-row gap-3">
            <SkeletonBlock
              color={blockColor}
              className="h-20 flex-1 rounded-2xl"
            />
            <SkeletonBlock
              color={blockColor}
              className="h-20 flex-1 rounded-2xl"
            />
            <SkeletonBlock
              color={blockColor}
              className="h-20 flex-1 rounded-2xl"
            />
          </View>
          <SkeletonBlock
            color={blockColor}
            className="mt-7 h-4 w-full rounded-xl"
          />
          <SkeletonBlock
            color={blockColor}
            className="mt-2 h-4 w-11/12 rounded-xl"
          />
          <SkeletonBlock
            color={blockColor}
            className="mt-2 h-4 w-3/4 rounded-xl"
          />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity }}>
      <View className="flex-row gap-4 px-5">
        {Array.from({ length: count }).map((_, index) => (
          <View key={index} style={{ width: 156 }}>
            <SkeletonBlock
              color={blockColor}
              className="h-[220px] w-full rounded-3xl"
              style={{ borderColor: colors.border, borderWidth: 1 }}
            />
            <SkeletonBlock
              color={blockColor}
              className="mt-3 h-4 w-11/12 rounded-xl"
            />
            <SkeletonBlock
              color={blockColor}
              className="mt-2 h-3 w-2/3 rounded-xl"
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default memo(LoadingSkeleton);
