import React from 'react'
import { format } from 'date-fns'
import RNFS from 'react-native-fs'

import { useShowAlert } from '@hooks'
import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications'
import { type DrawerNavigationProp } from '@react-navigation/drawer'

import {
  Box,
  Text,
  Image,
  Screen,
  Button,
  Divider,
  ThemeIcon,
  BackgroundLines,
} from '@components/atoms'

import { DEVICE_BOX_DIMENSIONS, OS } from 'src/constants'
import { MOCK_BASE64_IMAGE } from './mock_base64_image'

import type {
  LoggedInStackParamList,
  LoggedInStackScreenProps,
} from '@navigation/stacks/logged-in/logged-in.types'

const LiveView: React.FC<LoggedInStackScreenProps<'LiveView'>> = (props) => {
  const { navigation, route } = props

  const navigationDrawer = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const toast = useToast()
  
  const { t } = useTranslation()

  const showAlert = useShowAlert()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const handleTakeImage = async () => {
    let base64ImageData: string

    base64ImageData = MOCK_BASE64_IMAGE.replace(/^data:image\/png;base64,/, '')

    const now = new Date()
    const formattedDate = format(now, 'dd_MM_yyyy')
    const formattedTime = format(now, 'HH_mm_ss')
    const imageName = `ELECTRA_DEVICE_${route.params.device.serialNumber}_${formattedDate}_${formattedTime}.png`

    const filePath =
      OS === 'android'
        ? `${RNFS.ExternalDirectoryPath}/${imageName}`
        : `${RNFS.DocumentDirectoryPath}/${imageName}`

    try {
      await RNFS.writeFile(filePath, base64ImageData, 'base64')

      return showAlert({
        cancelable: true,
        title: t('liveView.show_alert_image_saved_title'),
        message: t('liveView.show_alert_image_saved_message'),
      })
    } catch (error) {
      console.error('Error writing image:', error)

      return showAlert({
        title: t('liveView.error'),
        message: t('liveView.error_message'),
      })
    }
  }

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

      <Box justifyContent="center">
        <ThemeIcon icon="LiveIcon" position="absolute" zIndex={1} top={10} left={25} />

        <Image
          resizeMode="stretch"
          style={{ height: 235 }}
          source={require('@assets/png/live-view.png')}
        />
      </Box>

      <Box px="md" justifyContent="center">
        <Text my="xs" variant="font14SemiBold" textAlign="center" color="secondary">
          9:41:11 AM
        </Text>

        <Divider mb="md" px="md" color="graphite_to_silverstone" />
      </Box>

      <Box
        mx="md"
        gap="sm"
        flex={1}
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
          onPress={handleTakeImage}
          width={DEVICE_BOX_DIMENSIONS}
          height={DEVICE_BOX_DIMENSIONS}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="TakePhotoIcon" />

          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('liveView.take_a_photo')}
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
            toast.show('Open Door is currently unavailable', { type: 'warning' })
          }
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="DoorIcon" />

          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('liveView.open_door')}
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
            {t('liveView.use_aux1')}
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
          <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="UseAuxIcon" />

          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('liveView.use_aux2')}
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
            toast.show('Switch camera is currently unavailable', { type: 'warning' })
          }
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <ThemeIcon
            icon="CameraIcon"
            color="ivory_to_charcoal"
            style={{ marginBottom: 3 }}
          />

          <Text
            px="xs"
            textAlign="center"
            variant="font14Regular"
            color="ivory_to_charcoal"
          >
            {t('liveView.switch_camera')}
          </Text>
        </Button>

        <Button
          flexGrow={1}
          width={DEVICE_BOX_DIMENSIONS}
          height={DEVICE_BOX_DIMENSIONS}
        />
      </Box>
    </Screen>
  )
}

export default LiveView
