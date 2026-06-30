import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

import { Typography, TypographyVariant } from "@/theme/typography";

type Props = TextProps & {
  variant?: TypographyVariant;
};

export function AppText({
  variant = "body",
  style,
  children,
  ...props
}: Props) {
  return (
    <Text
      style={[styles.text, Typography[variant], style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#FFFFFF",
  },
});