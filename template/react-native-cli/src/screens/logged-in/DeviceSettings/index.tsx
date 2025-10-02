import React from 'react'
import {
  type MediaType,
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker'
import { StyleSheet } from 'react-native'

import {
  useDeviceData,
  useDeviceUpdate,
  useDeviceDelete,
} from 'src/hooks/device-management'
import { useTheme } from '@theme/useTheme'
import { validateName } from '@helpers/index'
import { useTranslation } from 'react-i18next'
import {
  selectCurrentUser,
  selectCurrentUserDeviceBySerialNumber,
} from '@store/currentUser/currentUser.selectors'
import { useMuteDevice, useShowAlert } from '@hooks'
import { useDispatch, useSelector } from 'react-redux'
import { getStorageItem, setStorageItem } from '@storage'
import { type DrawerNavigationProp } from '@react-navigation/drawer'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { saveGalleryState } from '@store/galleryOpen/galleryOpen.actions'

import {
  Box,
  Text,
  Input,
  Image,
  Screen,
  Button,
  Loader,
  Divider,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import { AVATAR_SIZE } from 'src/constants'

import type {
  LoggedInStackParamList,
  LoggedInStackScreenProps,
} from '@navigation/stacks/logged-in/logged-in.types'

const DeviceSettings: React.FC<LoggedInStackScreenProps<'DeviceSettings'>> = (props) => {
  const { navigation, route } = props

  const { device, userRole } = route.params.device

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const showAlert = useShowAlert()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const currentUserRedux = useSelector(selectCurrentUser)
  const currentDeviceRedux = useSelector(
    selectCurrentUserDeviceBySerialNumber(device.serialNumber)
  )

  const navigationDrawer = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const { fetchDeviceDeleteData, loadingDeviceDeleteData } = useDeviceDelete()
  const { fetchDeviceUpdateData, loadingDeviceUpdateData } = useDeviceUpdate()
  const { fetchDeviceData, currentDeviceData } = useDeviceData(device.serialNumber)

  const { isMuteDevice, toggleMuteDevice } = useMuteDevice(device.serialNumber)

  const admin = currentDeviceData?.users.find((user) => user.second === 'DEVICE_OWNER')

  const [formData, setFormData] = React.useState({
    name: {
      value: currentDeviceRedux?.device.deviceName || device.deviceName,
      error: '',
    },
    admin: { value: admin?.first.second, error: '' },
  })

  const [deviceImage, setDeviceImage] = React.useState('')
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(undefined)

  const INPUT_FIELDS = [
    {
      key: 'name',
      value: formData.name.value,
      name: t('deviceSettings.name'),
      placeholder: device.deviceName,
    },
    {
      key: 'admin',
      value: formData.admin.value,
      name: t('deviceSettings.admin'),
      placeholder: admin?.first.second,
    },
  ]

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: { value, error: '' },
    }))
  }

  const renderErrorText = (error: string) =>
    error && (
      <Text color="error" variant="font13SemiBold">
        {error}
      </Text>
    )

  const handleSaveData = async () => {
    const nameValidation = validateName({
      name: formData.name.value,
      nameCannotBeEmpty: t('register.name_cant_be_empty'),
    })

    const updatedFormData = { ...formData }

    let isValid = true

    if (nameValidation) {
      updatedFormData.name.error = nameValidation
      isValid = false
    }

    if (!isValid) {
      setFormData(updatedFormData)
      return
    }

    await fetchDeviceUpdateData({
      serialNumber: device.serialNumber,
      newDeviceName: updatedFormData.name.value,
    })
  }

  const openGallery = () => {
    dispatch(saveGalleryState({ state: true }))

    const options: ImageLibraryOptions = {
      quality: 1,
      mediaType: 'photo' as MediaType,
    }

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('The user has deselected the image')
      } else if (response.errorMessage) {
        console.error('Error:', response.errorMessage)
      } else if (
        response.assets &&
        response.assets[0].uri &&
        response.assets.length > 0
      ) {
        await setStorageItem(
          `device${device.serialNumber}`,
          JSON.stringify(response.assets[0].uri)
        )
        setSelectedImage(response.assets[0].uri)
      }
    })
  }

  const handleRemoveDevice = async () => {
    if (!currentUserRedux) return

    showAlert({
      cancelable: true,
      cancelText: t('actions.cancel'),
      title: t('deviceSettings.show_alert_remove_device_title'),
      message: t('deviceSettings.show_alert_remove_device_message'),
      onPressText: t('deviceSettings.show_alert_remove_device_delete'),
      onPress: async () => {
        await fetchDeviceDeleteData({ serialNumber: device.serialNumber })

        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      },
    })
  }

  const getCurrentUserData = async () => {
    const storedDeviceImage = await getStorageItem(`device${device.serialNumber}`)
    const parsedDeviceImage: string = storedDeviceImage
      ? JSON.parse(storedDeviceImage)
      : ''

    setDeviceImage(parsedDeviceImage)
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchDeviceData()
      getCurrentUserData()
    }, [])
  )

  const imageSource = React.useMemo(() => {
    return selectedImage ? selectedImage : deviceImage
  }, [selectedImage, deviceImage])

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <Box
        px="sm"
        height={56}
        flexDirection="row"
        alignItems="center"
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

      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <Text mt="lg" variant="font24Bold" textAlign="center" color="secondary">
          {t('deviceSettings.device_settings')}
        </Text>

        <Box mt="xl" mb="sm" alignItems="center">
          <ThemeIcon
            bottom={-40}
            position="absolute"
            fill="charcoal_to_ivory"
            color="silver_to_steel"
            icon="LogoDecorativeCircleIcon"
          />
          <Box
            mt="xl"
            bg="cerulean"
            alignItems="center"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            justifyContent="center"
            borderRadius={AVATAR_SIZE}
          >
            {imageSource ? (
              <Image
                resizeMode="cover"
                style={styles.avatar}
                source={{ uri: imageSource }}
              />
            ) : (
              <React.Fragment>
                <ThemeIcon
                  top={17}
                  zIndex={1}
                  width={25}
                  height={23}
                  color="white"
                  icon="ElectraIcon"
                  position="absolute"
                />
                <Image
                  resizeMode="contain"
                  style={styles.interphone}
                  source={require('@assets/png/interphone.png')}
                />
              </React.Fragment>
            )}
          </Box>

          <Button
            zIndex={1}
            width={49}
            bottom={20}
            height={49}
            bg="silverstone"
            borderRadius={49}
            alignItems="center"
            onPress={openGallery}
            justifyContent="center"
          >
            <ThemeIcon icon="PhotoIcon" color="white" />
          </Button>
        </Box>

        <Box flex={1} justifyContent="space-between">
          <Box>
            {INPUT_FIELDS.map((inputFieldsProps) => {
              const { placeholder, value, name, key } = inputFieldsProps

              return (
                <Box key={key} px="md" mt="sm">
                  <Text
                    mb="xs"
                    variant="font16Regular"
                    color="slate_to_charcoal"
                    textTransform="uppercase"
                  >
                    {name}
                  </Text>

                  <Input
                    value={value}
                    maxLength={18}
                    autoCorrect={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    keyboardType="default"
                    placeholder={placeholder}
                    editable={
                      name !== t('deviceSettings.admin') && userRole !== 'DEVICE_VIEWER'
                    }
                    onChangeText={(text) =>
                      handleChange(key as keyof typeof formData, text)
                    }
                  />
                  {name === t('deviceSettings.name') &&
                    formData.name.error &&
                    renderErrorText(formData.name.error)}
                </Box>
              )
            })}
          </Box>

          <Box px="md" justifyContent="center">
            <Divider my="md" px="md" color="graphite_to_silverstone" />
          </Box>

          <Box>
            <Button
              mx="md"
              height={48}
              borderWidth={1}
              alignItems="center"
              justifyContent="center"
              borderColor="silverstone"
              bg={isMuteDevice ? 'cerulean' : 'transparent'}
              onPress={() =>
                showAlert({
                  cancelable: true,
                  title: !isMuteDevice
                    ? t('deviceSettings.mute')
                    : t('deviceSettings.unmute'),
                  cancelText: t('actions.cancel'),
                  onPressText: !isMuteDevice
                    ? t('deviceSettings.mute')
                    : t('deviceSettings.unmute'),
                  message: !isMuteDevice
                    ? t('deviceSettings.mute_device')
                    : t('deviceSettings.unmute_device'),
                  onPress: async () => {
                    toggleMuteDevice(!isMuteDevice)
                  },
                })
              }
            >
              <Text
                variant="font16Regular"
                color={isMuteDevice ? 'white' : 'ivory_to_steel'}
              >
                {isMuteDevice
                  ? t('deviceSettings.unmute_terminal')
                  : t('deviceSettings.mute_terminal')}
              </Text>
            </Button>

            <Button
              mt="sm"
              mx="md"
              height={48}
              borderWidth={1}
              alignItems="center"
              justifyContent="center"
              borderColor="silverstone"
              onPress={() =>
                navigation.navigate('Users', { device: route?.params?.device })
              }
            >
              <Text variant="font16Regular" color="ivory_to_steel">
                {t('deviceSettings.users')}
              </Text>
            </Button>

            <Button
              mt="sm"
              mx="md"
              height={48}
              borderWidth={1}
              alignItems="center"
              justifyContent="center"
              borderColor="silverstone"
              onPress={() => navigation.navigate('AboutApp')}
              mb={userRole === 'DEVICE_VIEWER' ? 'lg' : undefined}
            >
              <Text variant="font16Regular" color="ivory_to_steel">
                {t('deviceSettings.about')}
              </Text>
            </Button>
            {userRole === 'DEVICE_OWNER' && (
              <React.Fragment>
                <Button
                  mt="sm"
                  mx="md"
                  height={48}
                  borderWidth={1}
                  alignItems="center"
                  borderColor="error"
                  justifyContent="center"
                  onPress={handleRemoveDevice}
                  disabled={loadingDeviceDeleteData}
                  bg={statusBarStyle === 'light-content' ? 'red' : 'transparent'}
                >
                  <Text variant="font16Regular" color="error">
                    {t('deviceSettings.remove_device')}
                  </Text>
                  <Loader loading={loadingDeviceDeleteData} />
                </Button>

                <Button
                  mt="sm"
                  mb="lg"
                  mx="md"
                  height={48}
                  bg="cerulean"
                  alignItems="center"
                  justifyContent="center"
                  onPress={handleSaveData}
                  disabled={loadingDeviceUpdateData}
                >
                  <Text variant="font16Regular" color="white">
                    {t('actions.save')}
                  </Text>
                  <Loader loading={loadingDeviceUpdateData} />
                </Button>
              </React.Fragment>
            )}
          </Box>
        </Box>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
  },
  interphone: {
    height: 130,
    aspectRatio: 0.5 / 1,
  },
})

export default DeviceSettings
