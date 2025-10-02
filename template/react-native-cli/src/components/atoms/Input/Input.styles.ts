import { createStyles } from '@theme/createStyles'

type Props = {
  isEditable: boolean
  isActiveInput: boolean
}

export default createStyles((theme, props) => {
  const { colors, textVariants, spacing } = theme
  const { isActiveInput, isEditable = true } = props as Props

  return {
    input: {
      flex: 1,
      width: '100%',
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
      fontSize: textVariants.font14Regular.fontSize,
      fontWeight: textVariants.font14Regular.fontWeight,
      color: isEditable ? colors.silver_to_charcoal : colors.slate,
      borderColor: isActiveInput ? colors.cerulean : colors.silverstone,
      backgroundColor:
        isEditable === false ? colors.graphite_to_pearl : colors.pearl_to_transparent,
    },
  }
})
