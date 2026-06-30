export const Typography = {
  h1: {
    fontFamily: "InterBold",
    fontSize: 32,
    lineHeight: 40,
  },

  h2: {
    fontFamily: "InterBold",
    fontSize: 28,
    lineHeight: 36,
  },

  h3: {
    fontFamily: "InterSemiBold",
    fontSize: 22,
    lineHeight: 30,
  },

  title: {
    fontFamily: "InterSemiBold",
    fontSize: 18,
    lineHeight: 26,
  },

  body: {
    fontFamily: "InterRegular",
    fontSize: 16,
    lineHeight: 24,
  },

  bodySmall: {
    fontFamily: "InterRegular",
    fontSize: 14,
    lineHeight: 20,
  },

  caption: {
    fontFamily: "InterMedium",
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;