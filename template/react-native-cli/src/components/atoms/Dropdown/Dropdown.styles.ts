import { createStyles } from '@theme/createStyles'

import type { Theme } from '@theme/index'

type Props = {
  isOpened: boolean
  bg: keyof Theme['colors']
}

export default createStyles((theme, props) => {
  const { colors } = theme

  const { isOpened } = props as Props

  return {
    buttonStyle: {
      height: 54,
      elevation: 1,
      width: 'auto',
      borderWidth: 1,
      paddingHorizontal: 24,
      backgroundColor: colors.charcoal_to_ivory,
      borderColor: isOpened ? colors.cerulean : colors.pearl,
    },
    dropdownStyle: {
      elevation: 1,
      marginTop: 15,
      borderWidth: 1,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.cerulean,
      borderTopColor: colors.cerulean,
      borderBottomColor: colors.cerulean,
      backgroundColor: colors.charcoal_to_ivory,
    },
    rowStyle: {
      borderBottomWidth: 0,
      paddingHorizontal: 24,
    },
    rowTextStyle: {
      fontSize: 14,
      marginLeft: 0,
      textAlign: 'left',
      color: colors.secondary,
      textAlignVertical: 'center',
    },
    buttonTextStyle: {
      fontSize: 16,
    },
    selectedRowStyle: {
      backgroundColor: colors.ebony_to_pearl,
    },
    selectedRowTextStyle: {
      color: colors.secondary,
    },
  }
})
