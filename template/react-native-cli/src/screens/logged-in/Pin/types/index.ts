import { Spacing } from '@theme/utils/theme'

export namespace PinPad {
  export type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0'

  export type SpecialKey = {
    readonly backspace: '⌫'
    readonly empty: ''
  }

  export type Row = DigitRow | LastRow
  export type DigitRow = readonly [Digit, Digit, Digit]
  export type LastRow = readonly [SpecialKey['empty'], Digit, SpecialKey['backspace']]

  export type Matrix = readonly [DigitRow, DigitRow, DigitRow, LastRow]
}

export type PinPadButton = {
  style: {
    width: number
    height: number
    margin: Spacing
  }

  matrix: PinPad.Matrix
  empty: PinPad.SpecialKey['empty']
  backspace: PinPad.SpecialKey['backspace']
}
