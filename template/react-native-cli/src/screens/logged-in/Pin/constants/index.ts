import { WIDTH } from 'src/constants'

import type { PinPad, PinPadButton } from '@screens/logged-in/Pin/types'

const PIN_BUTTONS_MATRIX = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
] as const satisfies PinPad.Matrix

export const PIN_BUTTONS = {
  style: {
    width: WIDTH < 375 ? 60 : 80,
    height: WIDTH < 375 ? 60 : 80,
    margin: WIDTH < 375 ? 'xs' : 'sm',
  },

  matrix: PIN_BUTTONS_MATRIX,
  empty: PIN_BUTTONS_MATRIX[3][0],
  backspace: PIN_BUTTONS_MATRIX[3][2],
} as const satisfies PinPadButton
