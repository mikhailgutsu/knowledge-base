import React from 'react'

import { getStorageItem } from '@storage'
import { useSelector } from 'react-redux'
import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import {
  selectCurrentUser,
  selectCurrentUserDeviceBySerialNumber,
} from '@store/currentUser/currentUser.selectors'
import { useDeviceData } from 'src/hooks/device-management'
import { useToast } from 'react-native-toast-notifications'
import { type DrawerNavigationProp } from '@react-navigation/drawer'
import { useIsFocused, useNavigation } from '@react-navigation/native'

import {
  Box,
  Screen,
  Text,
  Image,
  Button,
  Divider,
  ThemeIcon,
  BackgroundLines,
} from '@components/atoms'

import { DEVICE_BOX_DIMENSIONS } from 'src/constants'

import type {
  LoggedInStackParamList,
  LoggedInStackScreenProps,
} from '@navigation/stacks/logged-in/logged-in.types'

const DeviceScreen: React.FC<LoggedInStackScreenProps<'Device'>> = (props) => {
  const { navigation, route } = props

  const toast = useToast()

  const { t } = useTranslation()

  const isFocused = useIsFocused()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const navigationDrawer = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const { device, userRole } = route?.params?.device ?? ''

  const [deviceImage, setDeviceImage] = React.useState('')

  const currentUserRedux = useSelector(selectCurrentUser)

  const currentDeviceRedux = useSelector(
    selectCurrentUserDeviceBySerialNumber(device.serialNumber)
  )

  const { fetchDeviceData, currentDeviceData } = useDeviceData(device.serialNumber)

  const admin = currentDeviceData?.users.find((user) => user.second === 'DEVICE_OWNER')

  const getCurrentUserData = async () => {
    const storedDeviceImage = await getStorageItem(`device${device.serialNumber}`)
    const parsedDeviceImage: string = storedDeviceImage
      ? JSON.parse(storedDeviceImage)
      : ''
    setDeviceImage(parsedDeviceImage)
  }

  React.useEffect(() => {
    if (isFocused) {
      fetchDeviceData()
      getCurrentUserData()
    }
  }, [isFocused, route.params.device])

  const getNextDevice = () => {
    if (!currentUserRedux?.devices || currentUserRedux.devices.length < 2) return null

    const devices = currentUserRedux.devices.map((item) => item)
    const currentIndex = devices.findIndex(
      (d) => d.device.serialNumber === device.serialNumber
    )

    if (currentIndex === -1) return null

    const nextIndex = currentIndex === devices.length - 1 ? 0 : currentIndex + 1
    return devices[nextIndex]
  }

  const nextDevice = getNextDevice()

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <BackgroundLines />

      <Box
        px="sm"
        height={56}
        alignItems="center"
        flexDirection="row"
        bg="ivory_to_charcoal"
        justifyContent="space-between"
      >
        <Button
          width={30}
          height={56}
          alignItems="center"
          justifyContent="center"
          onPress={navigation.goBack}
        >
          <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
        </Button>

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />

        <Button onPress={navigationDrawer.openDrawer}>
          <ThemeIcon icon="MenuIcon" color="charcoal_to_ivory" />
        </Button>
      </Box>

      <Box px="md" justifyContent="center">
        <Box my="md" flexDirection="row" justifyContent="space-between">
          <Box flex={0.35}>
            {deviceImage ? (
              <Image
                resizeMode="cover"
                style={{ height: 151, aspectRatio: 0.5 / 1 }}
                source={{ uri: deviceImage }}
              />
            ) : (
              <Image
                resizeMode="contain"
                style={{ height: 151, aspectRatio: 0.5 / 1 }}
                source={require('@assets/png/interphone.png')}
              />
            )}
          </Box>

          <Box flex={0.65}>
            <Text variant="font24Bold" color="secondary">
              {currentDeviceRedux?.device.deviceName}
            </Text>

            <Box mt="md">
              <Text variant="font14Regular" color="secondary">
                Serial number:
                {'   '}
                <Text color="silverstone_to_steel" variant="font14Regular">
                  {device.serialNumber}
                </Text>
              </Text>

              <Text mt="xs" variant="font14Regular" color="secondary">
                {t('devicePage.admin')}
                {'  '}
                <Text color="silverstone_to_steel" variant="font14Regular">
                  {admin?.first.second ?? 'USER'}
                </Text>
              </Text>
            </Box>
          </Box>
        </Box>

        <Button
          height={48}
          bg="cerulean"
          alignItems="center"
          justifyContent="center"
          onPress={() => navigation.navigate('LiveView', { device })}
        >
          <Text variant="font16Regular" color="white">
            {t('devicePage.live_view')}
          </Text>
        </Button>

        <Divider my="md" color="graphite_to_silverstone" />
      </Box>

      <Box
        mx="md"
        flex={1}
        gap="sm"
        flexWrap="wrap"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Button
          flexGrow={1}
          elevation={5}
          alignItems="center"
          bg="graphite_to_pearl"
          justifyContent="center"
          width={DEVICE_BOX_DIMENSIONS}
          height={DEVICE_BOX_DIMENSIONS}
          onPress={() => navigation.navigate('Activity', { device })}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="ClockIcon" />
          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('devicePage.activity')}
          </Text>
        </Button>

        <Button
          flexGrow={1}
          elevation={5}
          alignItems="center"
          bg="graphite_to_pearl"
          justifyContent="center"
          width={DEVICE_BOX_DIMENSIONS}
          height={DEVICE_BOX_DIMENSIONS}
          onPress={() => navigation.navigate('Gallery', { device })}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="GalleryIcon" />
          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('devicePage.gallery')}
          </Text>
        </Button>

        {nextDevice && (
          <Button
            flexGrow={1}
            elevation={5}
            alignItems="center"
            bg="graphite_to_pearl"
            justifyContent="center"
            width={DEVICE_BOX_DIMENSIONS}
            height={DEVICE_BOX_DIMENSIONS}
            onPress={() => navigation.setParams({ device: nextDevice })}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="DeviceIcon" />
            <Text
              px="xs"
              textAlign="center"
              variant="font14Regular"
              color="ivory_to_charcoal"
            >
              {nextDevice.device.deviceName}
            </Text>
          </Button>
        )}

        <Button
          flexGrow={1}
          elevation={5}
          alignItems="center"
          bg="graphite_to_pearl"
          justifyContent="center"
          width={DEVICE_BOX_DIMENSIONS}
          height={DEVICE_BOX_DIMENSIONS}
          onPress={() =>
            toast.show('AUX 1 is currently unavailable', { type: 'warning' })
          }
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="DeviceAddIcon" />
          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('devicePage.aux1')}
          </Text>
        </Button>

        <Button
          flexGrow={1}
          elevation={5}
          alignItems="center"
          bg="graphite_to_pearl"
          justifyContent="center"
          width={DEVICE_BOX_DIMENSIONS}
          height={DEVICE_BOX_DIMENSIONS}
          onPress={() =>
            toast.show('AUX 2 is currently unavailable', { type: 'warning' })
          }
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="DeviceAddIcon" />
          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('devicePage.aux2')}
          </Text>
        </Button>

        <Button
          flexGrow={1}
          elevation={5}
          alignItems="center"
          bg="graphite_to_pearl"
          justifyContent="center"
          width={DEVICE_BOX_DIMENSIONS}
          height={DEVICE_BOX_DIMENSIONS}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          onPress={() =>
            navigation.navigate('DeviceSettings', { device: route?.params?.device })
          }
        >
          <ThemeIcon
            color="ivory_to_charcoal"
            icon="SettingsIcon"
            style={{ marginBottom: 3 }}
          />
          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('devicePage.deviceSettings')}
          </Text>
        </Button>

        {!nextDevice && (
          <Button
            flexGrow={1}
            width={DEVICE_BOX_DIMENSIONS}
            height={DEVICE_BOX_DIMENSIONS}
          ></Button>
        )}
      </Box>
    </Screen>
  )
}

export default DeviceScreen
