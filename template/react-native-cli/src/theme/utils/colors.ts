const palette = {
  transparent: 'transparent',

  black: 'rgba(0, 0, 0, 1)',
  black_05: 'rgba(0, 0, 0, 0.5)',

  white: 'rgba(255, 255, 255, 1)',
  white_05: 'rgba(255, 255, 255, 0.5)',

  // gray pallete
  ivory: 'rgba(248, 248, 248, 1)',
  pearl: 'rgba(237, 237, 237, 1)',
  silver: 'rgba(204, 204, 204, 1)',
  silverstone: 'rgba(179, 179, 179, 1)',
  slate: 'rgba(148, 148, 148, 1)',
  steel: 'rgba(98, 97, 97, 1)',
  graphite: 'rgba(54, 54, 54, 1)',
  charcoal: 'rgba(43, 42, 41, 1)',
  ebony: 'rgba(37, 36, 35, 1)',
  // gray pallete

  // yellow pallete
  gold: 'rgba(251, 188, 5, 1)',
  // yellow pallete

  // blue pallete
  cerulean: 'rgba(62, 157, 195, 1)',
  // blue pallete

  //green pallete
  succes: 'rgba(52, 168, 83, 1)',
  //green pallete

  //red pallete
  error: 'rgba(234, 67, 53, 1)',
  red: 'rgba(234, 67, 53, 0.1)',
  //red pallete
}

export const LIGHT_THEME_BASE_COLORS = {
  ...palette,

  primary: palette.white,
  secondary: palette.black,

  white_to_charcoal: palette.charcoal,

  ivory_to_charcoal: palette.charcoal,
  ivory_to_steel: palette.steel,
  ivory_to_graphite: palette.ivory,

  charcoal_to_white: palette.white,
  charcoal_to_silver: palette.silver,
  charcoal_to_pearl: palette.charcoal,
  charcoal_to_ivory: palette.ivory,
  charcoal_to_transparent: palette.charcoal,

  silver_to_charcoal: palette.charcoal,
  silver_to_steel: palette.silver,

  silverstone_to_steel: palette.steel,

  slate_to_charcoal: palette.charcoal,

  graphite_to_silver: palette.silver,
  graphite_to_pearl: palette.pearl,
  graphite_to_silverstone: palette.silverstone,

  ebony_to_pearl: palette.pearl,

  pearl_to_transparent: palette.pearl,
  pearl_to_cerulean: palette.cerulean,
  pearl_to_graphite: palette.graphite,
  pearl_to_slate: palette.pearl,

  // * white color variants
  white_to_black: palette.white,

  white_05_to_black_05: palette.white_05,
  // * white color variants
}

export const DARK_THEME_BASE_COLORS = {
  ...palette,

  primary: palette.black,
  secondary: palette.white,

  white_to_charcoal: palette.white,

  ivory_to_charcoal: palette.ivory,
  ivory_to_steel: palette.ivory,
  ivory_to_graphite: palette.graphite,

  charcoal_to_ivory: palette.charcoal,
  charcoal_to_white: palette.charcoal,
  charcoal_to_silver: palette.charcoal,
  charcoal_to_pearl: palette.pearl,
  charcoal_to_transparent: palette.transparent,

  silver_to_charcoal: palette.silver,
  silver_to_steel: palette.steel,

  silverstone_to_steel: palette.silverstone,

  slate_to_charcoal: palette.slate,

  graphite_to_silver: palette.graphite,
  graphite_to_pearl: palette.graphite,
  graphite_to_silverstone: palette.graphite,

  ebony_to_pearl: palette.ebony,

  pearl_to_transparent: palette.transparent,
  pearl_to_cerulean: palette.pearl,
  pearl_to_graphite: palette.pearl,
  pearl_to_slate: palette.slate,

  // * white color variants
  white_to_black: palette.black,

  white_05_to_black_05: palette.black_05,
  // * white color variants
}
