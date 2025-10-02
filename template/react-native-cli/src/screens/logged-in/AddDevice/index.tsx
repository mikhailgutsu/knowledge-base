import React from 'react'
import { StyleSheet } from 'react-native'

import {
  Camera,
  type Code,
  useCodeScanner,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera'
import QRCode from 'react-native-qrcode-svg'

import { getStorageItem } from '@storage'
import { useTheme } from '@theme/useTheme'
import { useAppStateStatus } from '@hooks'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import { useAddDevice } from 'src/hooks/device-management'
import { useToast } from 'react-native-toast-notifications'
import { showRequestCameraPermissionAlert } from '@helpers/index'
import { useUserConfirmInvitation } from 'src/hooks/user-management'

import { Box, Text, Input, Button, Screen, ThemeIcon, Loader } from '@components/atoms'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const INTERFONE_STRING = '3'

const AddDeviceScreen: React.FC<LoggedInStackScreenProps<'AddDevice'>> = (props) => {
  const { navigation } = props

  const toast = useToast()

  const { t } = useTranslation()

  const isFocused = useIsFocused()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const deviceCamera = useCameraDevice('back')
  const { hasPermission } = useCameraPermission()
  const format = useCameraFormat(deviceCamera, [{ photoAspectRatio: 1 / 1 }])

  const { appStateStatus } = useAppStateStatus()
  const isActive = isFocused && appStateStatus === 'active'

  const { loadingDeviceAdd, fetchDeviceAdd } = useAddDevice()
  const { loadingUserConfirmInvitation, fetchUserConfirmInvitation } =
    useUserConfirmInvitation()

  const [key, setKey] = React.useState<string>('')
  const [code, setCode] = React.useState<string>('')
  const [serialNumber, setSerialNumber] = React.useState<string>('')

  const [toggleMethod, setToggleMethod] = React.useState(true)
  const [toggleManuallyCode, setToggleManuallyCode] = React.useState(false)

  const [confirmInvitation, setConfirmInvitation] = React.useState(false)

  const handleSubmit = async () => {
    if (!key.trim()) {
      toast.show(t('addDevice.input_cant_be_empty'), { type: 'warning' })
      return
    }

    const requestData = {
      serialNumber: key,
      deviceName: `Device ${key}`,
    }

    await fetchDeviceAdd(requestData)
  }

  const onCodeScanned = React.useCallback(async (codes: Code[]) => {
    const value = codes[0]?.value

    if (value == null) {
      return
    }

    const fcmToken = await getStorageItem<string>('fcmToken')

    if (fcmToken !== null) {
      const requestData = {
        token: fcmToken,
        serialNumber: INTERFONE_STRING,
        deviceName: `Device ${INTERFONE_STRING}`,
      }

      await fetchDeviceAdd(requestData)
    }
  }, [])

  const codeScanner = useCodeScanner({ codeTypes: ['qr', 'ean-13'], onCodeScanned })

  if (!hasPermission) {
    showRequestCameraPermissionAlert()
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <Box>
        <Box
          height={56}
          alignItems="center"
          bg="ivory_to_charcoal"
          justifyContent="center"
        >
          <Button
            left={10}
            width={30}
            height={56}
            position="absolute"
            alignItems="center"
            justifyContent="center"
            onPress={navigation.goBack}
          >
            <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
          </Button>

          <ThemeIcon
            width={156}
            height={23}
            icon="ElectraIcon"
            color="charcoal_to_ivory"
          />
        </Box>

        {confirmInvitation ? (
          <Text variant="font24Bold" color="secondary" textAlign="center" mt="lg">
            {t('addDevice.confirm_invitation')}
          </Text>
        ) : (
          <React.Fragment>
            <Text variant="font24Bold" color="secondary" textAlign="center" mt="lg">
              {toggleMethod
                ? t('addDevice.scan_or_enter_code')
                : t('addDevice.scan_qr_code')}
            </Text>
            <Button
              mx="md"
              my="md"
              height={48}
              bg="cerulean"
              alignItems="center"
              justifyContent="center"
              onPress={() => setToggleMethod((prevState) => !prevState)}
            >
              <Text color="white" textAlign="center">
                {t('addDevice.activated_qr')}
                {toggleMethod ? t('addDevice.scan') : t('addDevice.code')}
              </Text>
            </Button>
          </React.Fragment>
        )}
      </Box>

      {confirmInvitation && (
        <Box flex={1} mx="md" mb="lg" justifyContent="space-between">
          <Box my="md">
            <Text my="sm" variant="font16Regular" color="ivory_to_steel">
              Serial Number
            </Text>
            <Input
              value={serialNumber}
              maxLength={2}
              placeholder="Serial Number"
              autoCorrect={false}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={(text) => setSerialNumber(text.replace(/[^0-9]/g, ''))}
            />
            <Text my="sm" variant="font16Regular" color="ivory_to_steel">
              Code
            </Text>

            <Input
              value={code}
              maxLength={4}
              placeholder="Code"
              autoCorrect={false}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))}
            />
          </Box>

          <Button
            height={48}
            bg="cerulean"
            alignItems="center"
            justifyContent="center"
            disabled={loadingUserConfirmInvitation}
            onPress={async () => await fetchUserConfirmInvitation({ serialNumber, code })}
          >
            <Text variant="font16Regular" color="white">
              {t('addDevice.enter')}
            </Text>
            <Loader loading={loadingUserConfirmInvitation} />
          </Button>
        </Box>
      )}

      {!toggleMethod && !confirmInvitation && (
        <Box flex={1}>
          <Box
            flex={1}
            width={230}
            height={230}
            alignSelf="center"
            alignItems="center"
            justifyContent="center"
          >
            <Box padding="lg">
              <QRCode
                size={158}
                color="black"
                quietZone={20}
                logoMargin={2}
                logoBorderRadius={20}
                backgroundColor="white"
                value={INTERFONE_STRING}
                logoBackgroundColor="transparent"
                logo={require('@assets/png/electra.png')}
              />

              <Box
                top={0}
                left={0}
                width={80}
                height={80}
                borderTopWidth={3}
                borderLeftWidth={3}
                position="absolute"
                borderColor="slate"
              />
              <Box
                top={0}
                right={0}
                width={80}
                height={80}
                borderTopWidth={3}
                position="absolute"
                borderColor="slate"
                borderRightWidth={3}
              />
              <Box
                left={0}
                width={80}
                bottom={0}
                height={80}
                position="absolute"
                borderColor="slate"
                borderLeftWidth={3}
                borderBottomWidth={3}
              />
              <Box
                right={0}
                bottom={0}
                width={80}
                height={80}
                position="absolute"
                borderColor="slate"
                borderRightWidth={3}
                borderBottomWidth={3}
              />
            </Box>
          </Box>

          <Text mt="md" textAlign="center">
            {t('addDevice.set_manually')} - {INTERFONE_STRING}
          </Text>
        </Box>
      )}

      {toggleMethod && !toggleManuallyCode && !confirmInvitation && (
        <Box flex={1} mx="md">
          <Box aspectRatio={1 / 1}>
            {deviceCamera != null && hasPermission && (
              <Camera
                fps={30}
                torch="off"
                format={format}
                resizeMode="cover"
                isActive={isActive}
                device={deviceCamera}
                enableZoomGesture={true}
                codeScanner={codeScanner}
                style={StyleSheet.absoluteFillObject}
                onError={(error) => {
                  return toast.show(`Camera Access Error ${error?.message ?? ''}`, {
                    type: 'danger',
                  })
                }}
              />
            )}

            <Box flex={1}>
              <Box
                top={0}
                left={0}
                right={0}
                height="25%"
                position="absolute"
                backgroundColor="white_05_to_black_05"
              />
              <Box
                left={0}
                right={0}
                bottom={0}
                height="25%"
                position="absolute"
                backgroundColor="white_05_to_black_05"
              />
              <Box
                left={0}
                top="25%"
                width="25%"
                bottom="25%"
                position="absolute"
                backgroundColor="white_05_to_black_05"
              />
              <Box
                top="25%"
                right={0}
                width="25%"
                bottom="25%"
                position="absolute"
                backgroundColor="white_05_to_black_05"
              />
              <Box
                top="25%"
                left="25%"
                width="50%"
                height="50%"
                borderWidth={1}
                position="absolute"
                borderColor="graphite"
                backgroundColor="transparent"
              />
            </Box>
          </Box>
        </Box>
      )}

      {toggleMethod && toggleManuallyCode && !confirmInvitation && (
        <Box flex={1} mx="md" mb="lg" justifyContent="space-between">
          <Box my="md">
            <Input
              value={key}
              maxLength={2}
              placeholder="Code"
              autoCorrect={false}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={(text) => setKey(text.replace(/[^0-9]/g, ''))}
            />
          </Box>

          <Button
            height={48}
            bg="cerulean"
            alignItems="center"
            onPress={handleSubmit}
            justifyContent="center"
            disabled={loadingDeviceAdd}
          >
            <Text variant="font16Regular" color="white">
              {t('addDevice.enter')}
            </Text>
            <Loader loading={loadingDeviceAdd} />
          </Button>
        </Box>
      )}

      <Box mb="md" justifyContent="flex-end">
        {toggleMethod && (
          <Button
            onPress={() => {
              setToggleManuallyCode((prevState) => !prevState)
              setConfirmInvitation(false)
            }}
          >
            <Text color="cerulean" textAlign="center">
              {toggleManuallyCode
                ? t('addDevice.scan_via_qr_code')
                : t('addDevice.q_enter_code_manually')}
            </Text>
          </Button>
        )}
        {!confirmInvitation && (
          <Button mt="sm" onPress={() => setConfirmInvitation(true)}>
            <Text color="white_to_charcoal" textAlign="center">
              Confirm invitation
            </Text>
          </Button>
        )}
      </Box>
    </Screen>
  )
}

export default AddDeviceScreen
