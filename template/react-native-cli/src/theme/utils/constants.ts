export const METRICS_SIZES = {
  zero: 0,
  xs: 8,
  extraSmall: 10,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
}

const FONTS_10 = {
  font10ExtraBold: {
    fontSize: 10,
    fontWeight: '900',
  },
}

const FONTS_13 = {
  font13SemiBold: {
    fontSize: 13,
    fontWeight: '500',
  },
}

const FONTS_14 = {
  font14Regular: {
    fontSize: 14,
    fontWeight: '400',
  },
  font14SemiBold: {
    fontSize: 14,
    fontWeight: '500',
  },
  font14Medium: {
    fontSize: 14,
    fontWeight: '600',
  },
  font14Bold: {
    fontSize: 14,
    fontWeight: '700',
  },
}

const FONTS_16 = {
  font16Regular: {
    fontSize: 16,
    fontWeight: '400',
  },
  font16SemiBold: {
    fontSize: 16,
    fontWeight: '500',
  },
  font16Bold: {
    fontSize: 16,
    fontWeight: '700',
  },
}

const FONTS_18 = {
  font18Regular: {
    fontSize: 18,
    fontWeight: '400',
  },
  font18Bold: {
    fontSize: 18,
    fontWeight: '700',
  },
}

const FONTS_24 = {
  font24Bold: {
    fontSize: 24,
    fontWeight: '700',
  },
}

const FONTS_28 = {
  font28SemiBold: {
    fontSize: 28,
    fontWeight: '500',
  },
  font28Bold: {
    fontSize: 28,
    fontWeight: '700',
  },
}

export const FONTS = {
  ...FONTS_10,

  ...FONTS_13,

  ...FONTS_14,

  ...FONTS_16,

  ...FONTS_18,

  ...FONTS_24,

  ...FONTS_28,

  defaults: {
    fontSize: 16,
    fontWeight: '500',
  },
}
