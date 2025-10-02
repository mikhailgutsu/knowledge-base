import React from 'react'
import * as Keychain from 'react-native-keychain'
import { TextInput, type TextInputProps } from 'react-native'

import useStyles from './Input.styles'
import { getStorageItem } from '@storage'
import { useTheme } from '@theme/useTheme'

import { EyeClosedIcon, EyeOpenIcon } from '../Icons'
import { Box, Button, ThemeIcon, type Icon } from '@components/atoms'

import { OS, INPUT_HEIGHT } from 'src/constants'

interface IInputProps extends TextInputProps {
  height?: number
  isAutoFill?: boolean
  isLoginScreen?: boolean
  disableInputFocusing?: boolean
  setIsAutoFill?: (value: boolean) => void
  Icon?: Icon | (JSX.Element | ((isActive: boolean) => JSX.Element))
}

const PWD_ICONS = { true: EyeClosedIcon, false: EyeOpenIcon }

const Input: React.FC<IInputProps> = (props) => {
  const {
    Icon,
    selectionColor,
    isAutoFill = false,
    placeholderTextColor,
    isLoginScreen = false,
    height = INPUT_HEIGHT,
    secureTextEntry = false,
    disableInputFocusing = false,
    ...restProps
  } = props

  const { colors, spacing } = useTheme()

  const [isActiveInput, setIsActiveInput] = React.useState(false)
  const [isPasswordInput, setIsPasswordInput] = React.useState(secureTextEntry)

  const styles = useStyles({
    isActiveInput,
    isPasswordInput,
    hasIcon: !!Icon,
    isEditable: restProps.editable,
  })

  const PasswordIcon = PWD_ICONS[String(isPasswordInput) as keyof typeof PWD_ICONS]

  return (
    <Box position="relative" alignItems="center" flexDirection="row">
      <TextInput
        cursorColor={colors.slate}
        secureTextEntry={isPasswordInput}
        style={[styles.input, restProps.style, { height: height }]}
        onFocus={(event) => {
          if (!disableInputFocusing) {
            event.currentTarget.focus()
            setIsActiveInput(true)
          }
        }}
        onBlur={async (event) => {
          if (!disableInputFocusing) {
            event.currentTarget.blur()
            setIsActiveInput(false)

            if (isLoginScreen && !restProps.value) {
              const storedServices = await getStorageItem<string>('services')
              const credentials = await Keychain.getGenericPassword({
                service: storedServices ?? '',
              })
              if (credentials) {
                if (restProps.placeholder === 'Password') {
                  restProps.onChangeText?.(credentials.password)
                  props.setIsAutoFill?.(true)
                  setIsPasswordInput(true)
                }

                if (restProps.placeholder === 'Email') {
                  restProps.onChangeText?.(credentials.service)
                }
              }
            }
          }
        }}
        selectionColor={
          placeholderTextColor || selectionColor || OS === 'android'
            ? undefined
            : colors.slate
        }
        placeholderTextColor={placeholderTextColor || selectionColor || colors.slate}
        {...restProps}
      />

      {(Icon || secureTextEntry) && !isAutoFill && (
        <Box position="absolute" zIndex={0} right={spacing.sm}>
          {Icon ? (
            typeof Icon === 'string' ? (
              <ThemeIcon icon={Icon} color={!disableInputFocusing ? 'slate' : 'slate'} />
            ) : typeof Icon === 'function' ? (
              Icon(isActiveInput)
            ) : (
              Icon
            )
          ) : (
            <Button
              width={33}
              height={INPUT_HEIGHT}
              alignItems="flex-end"
              justifyContent="center"
              onPress={() => setIsPasswordInput((prev) => !prev)}
            >
              <PasswordIcon color={isActiveInput ? colors.cerulean : colors.slate} />
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}

export type InputProps = IInputProps
export type InputRef = TextInput

export default Input
