import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import { getStorageItem, setStorageItem } from '@storage'
import { useToast } from 'react-native-toast-notifications'
import { type NativeStackNavigationProp } from '@react-navigation/native-stack'
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native'

import { BackgroundLines, Box, Button, Screen, Text, ThemeIcon } from '@components/atoms'

import { WIDTH } from 'src/constants'

import type { LoggedOutStackParamList } from '@navigation/stacks/logged-out/logged-out.types'

type PincodeScreenRouteProp = RouteProp<LoggedOutStackParamList, 'Pincode'>

const PincodeScreen = () => {
  const route = useRoute<PincodeScreenRouteProp>()
  const navigation =
    useNavigation<NativeStackNavigationProp<LoggedOutStackParamList, 'Pincode'>>()

  const toast = useToast()

  const { t } = useTranslation()

  const change_pin = route.params?.change

  const { colors, isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [pin, setPin] = React.useState<string>('')
  const [createNewPin, setCreateNewPin] = React.useState<boolean>(
    route.params?.value || false
  )
  const [isCreating, setIsCreating] = React.useState<boolean>(false)
  const [storedPin, setStoredPin] = React.useState<string | null>(null)
  const [isConfirming, setIsConfirming] = React.useState<boolean>(false)

  React.useEffect(() => {
    const loadStoredPin = async () => {
      try {
        if (createNewPin) return

        const storedPin = await getStorageItem<string>('PIN')

        console.log('storedPin  ->', storedPin)

        if (storedPin) {
          setIsCreating(true)
          setIsConfirming(true)
          if (storedPin === pin && pin.length === 4) {
            console.log('storedPin  ->', storedPin, 'pin ->', pin)

            if (change_pin) {
              setPin('')
              navigation.goBack()
              setIsCreating(false)
              setCreateNewPin(true)
              setIsConfirming(false)
            } else navigation.replace('IntroSlide')
          } else if (pin.length === 4) {
            toast.show(t('pin.pin_incorrect'), { type: 'danger', duration: 1500 })
            setPin('')
          }
        }
      } catch (error) {
        console.error('Warning loading PIN from storage:', error)
      }
    }

    loadStoredPin()
  }, [navigation, pin])

  const handleToCreateNewPin = () => {
    if (pin.length !== 4) {
      toast.show(t('pin.pin_enter_4_digit'), { type: 'danger' })
      return setPin('')
    }

    setIsCreating(true)
    setStoredPin(pin)
    setPin('')
  }

  const validateConfirmation = async () => {
    if (storedPin === pin) {
      setPin('')
      setIsConfirming(true)
      setCreateNewPin(false)
      setStorageItem('PIN', pin)
      if (!change_pin) navigation.navigate('Successfuly')
    } else {
      toast.show(t('pin.pin_do_not_match'), { type: 'danger' })
      setPin('')
    }
  }

  const isPressing = React.useRef(false)

  const handleButtonPress = (value: string) => {
    if (isPressing.current || pin.length >= 4) return
    isPressing.current = true

    setPin((prev) => prev + value)
    setTimeout(() => {
      isPressing.current = false
    }, 150)
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
  }

  const renderPinCircles = () => (
    <Box flexDirection="row">
      {[...Array(4)].map((_, index) => (
        <Box
          width={15}
          height={15}
          key={index}
          borderRadius={10}
          marginHorizontal="xs"
          bg={index < pin.length ? 'cerulean' : 'slate'}
        />
      ))}
    </Box>
  )

  const renderNumberButtons = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫'],
    ]
    return numbers.map((row, rowIndex) => {
      return (
        <Box key={rowIndex} flexDirection="row">
          {row.map((num) => {
            if (num === '⌫' && pin.length === 0) {
              return null
            }

            const isDisabledPinNumberButtons = pin.length === 4 && num !== '⌫'

            return num !== '' ? (
              <Button
                key={num}
                elevation={5}
                borderRadius={40}
                alignItems="center"
                justifyContent="center"
                width={WIDTH < 375 ? 60 : 80}
                height={WIDTH < 375 ? 60 : 80}
                onLongPress={() => setPin('')}
                margin={WIDTH < 375 ? 'xs' : 'sm'}
                disabled={isDisabledPinNumberButtons}
                onPress={() => (num === '⌫' ? handleDelete() : handleButtonPress(num))}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? colors.cerulean : colors.graphite_to_pearl,
                })}
              >
                <Text variant="font28SemiBold" color="secondary">
                  {num}
                </Text>
              </Button>
            ) : (
              <Box
                key="empty"
                width={WIDTH < 375 ? 60 : 80}
                height={WIDTH < 375 ? 60 : 80}
                margin={WIDTH < 375 ? 'xs' : 'sm'}
              />
            )
          })}
        </Box>
      )
    })
  }

  const goBackHandler = () => {
    setPin('')
    navigation.goBack()
    setIsCreating(false)
    setCreateNewPin(true)
    setIsConfirming(false)
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusBarStyle={statusBarStyle}
      statusColor="white_to_charcoal"
    >
      <BackgroundLines />

      <Box height={56} alignItems="center" bg="ivory_to_charcoal" justifyContent="center">
        {change_pin && (
          <Button
            left={10}
            width={30}
            height={56}
            position="absolute"
            alignItems="center"
            justifyContent="center"
            onPress={goBackHandler}
          >
            <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
          </Button>
        )}

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />
      </Box>

      <Box flex={1} pb="xl" paddingHorizontal="md">
        <Box flex={1} alignItems="center" justifyContent="space-evenly">
          <Text color="secondary" variant={WIDTH < 375 ? 'font24Bold' : 'font28Bold'}>
            {!isCreating
              ? t('pin.pin_create_new')
              : !isConfirming
              ? t('pin.pin_confirm')
              : t('pin.pin_enter')}
          </Text>

          {renderPinCircles()}

          <Box>{renderNumberButtons()}</Box>
        </Box>

        {
          !isCreating ? (
            <Box gap="md" height={48} alignSelf="center" flexDirection="row">
              <Button
                flex={1}
                borderWidth={1}
                alignItems="center"
                bg="charcoal_to_ivory"
                justifyContent="center"
                onPress={() => setPin('')}
                borderColor="ivory_to_steel"
              >
                <Text variant="font16Regular" color="secondary">
                  {t('actions.clear')}
                </Text>
              </Button>

              <Button
                flex={1}
                bg="cerulean"
                alignItems="center"
                justifyContent="center"
                onPress={() => handleToCreateNewPin()}
              >
                <Text variant="font16Regular" color="white">
                  {t('actions.create')}
                </Text>
              </Button>
            </Box>
          ) : !isConfirming ? (
            <Box gap="md" height={48} alignSelf="center" flexDirection="row">
              <Button
                flex={1}
                bg="cerulean"
                alignItems="center"
                justifyContent="center"
                onPress={() => validateConfirmation()}
              >
                <Text variant="font16Regular" color="white">
                  {t('actions.confirm')}
                </Text>
              </Button>
            </Box>
          ) : null
          // <Box height={48}>
          //   {!change_pin && (
          //     <Button onPress={() => navigation.navigate('ResetEmail', { value: 'pin' })}>
          //       <Text variant="font16SemiBold" color="cerulean" textAlign="center">
          //         {t('actions.forget_pin')}
          //       </Text>
          //     </Button>
          //   )}
          // </Box>
        }
      </Box>
    </Screen>
  )
}

export default PincodeScreen
