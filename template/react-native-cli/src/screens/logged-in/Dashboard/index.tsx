import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import { useCurrentUser, useMuteApp } from '@hooks'
import { type DrawerNavigationProp } from '@react-navigation/drawer'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import {
  Box,
  Text,
  Image,
  Screen,
  Button,
  Switch,
  Divider,
  ThemeIcon,
  BackgroundLines,
} from '@components/atoms'

import { DEVICE_BOX_DIMENSIONS } from 'src/constants'

import type { LoggedInStackParamList } from '@navigation/stacks/logged-in/logged-in.types'

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const { t } = useTranslation()

  const { isMuteApp, toggleMuteApp } = useMuteApp()

  const { colors, isDarkTheme, toggleTheme } = useTheme()
  const statusBarStyle = 'light-content'

  const { currentUserData, currentUserAvatar, fetchCurrentUserData } = useCurrentUser()

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentUserData()
    }, [])
  )

  return (
    <Screen bg="charcoal_to_white" statusColor="charcoal" statusBarStyle={statusBarStyle}>
      <BackgroundLines />

      <Box justifyContent="center">
        <Box
          px="md"
          py="sm"
          flexDirection="row"
          bg="charcoal_to_transparent"
          justifyContent="space-between"
        >
          <Box flexDirection="row">
            <Box
              width={42}
              height={42}
              bg="cerulean"
              borderRadius={42}
              alignItems="center"
              justifyContent="center"
            >
              {currentUserAvatar ? (
                <Image
                  resizeMode="cover"
                  style={{
                    flex: 1,
                    height: 42,
                    width: '100%',
                    borderWidth: 1,
                    borderRadius: 42,
                    aspectRatio: 1 / 1,
                    borderColor: colors.charcoal,
                  }}
                  source={{ uri: currentUserAvatar }}
                />
              ) : (
                <ThemeIcon icon="UserIcon" strokeWidth={1.7} />
              )}
            </Box>

            <Box>
              <Text ml="sm" variant="font14Regular" color="white">
                {t('dashBoard.welcome_home')}
              </Text>

              <Text ml="sm" variant="font14Regular" color="silver">
                {currentUserData?.fullName ?? 'USER'}
              </Text>
            </Box>
          </Box>

          <Box flexDirection="row" alignItems="center">
            <Button onPress={() => navigation.navigate('Notifications')}>
              <ThemeIcon icon="NotificationsIcon" color="silver" />
            </Button>

            <Button ml="md" onPress={navigation.openDrawer}>
              <ThemeIcon icon="MenuIcon" color="silver" />
            </Button>
          </Box>
        </Box>

        <Box mt="md" px="md" flexDirection="row" justifyContent="space-between">
          <Box flex={0.4}>
            <Image
              resizeMode="contain"
              style={{
                height: 151,
                aspectRatio: 0.5 / 1,
              }}
              source={require('@assets/png/interphone.png')}
            />
          </Box>

          <Box mt="md" flex={0.6}>
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="font16SemiBold" color="secondary">
                {t('dashBoard.mute')}
              </Text>

              <Switch value={isMuteApp} onValueChange={toggleMuteApp} />
            </Box>

            <Box mt="md" flexDirection="row" justifyContent="space-between">
              <Text variant="font16SemiBold" color="white_to_charcoal">
                {t('dashBoard.screen_mode')}
              </Text>

              <Switch isTheme value={isDarkTheme} onValueChange={toggleTheme} />
            </Box>
          </Box>
        </Box>

        <Box
          px="md"
          gap="sm"
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Divider mt="md" color="graphite_to_silverstone" />

          <Button
            flexGrow={
              currentUserData?.devices?.length === 1
                ? 0.3
                : currentUserData?.devices?.length === 2
                ? 0.7
                : 1
            }
            elevation={5}
            alignItems="center"
            bg="graphite_to_pearl"
            justifyContent="center"
            width={DEVICE_BOX_DIMENSIONS}
            height={DEVICE_BOX_DIMENSIONS}
            onPress={() => navigation.navigate('AddDevice')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="DeviceAdd" />

            <Text color="ivory_to_charcoal" variant="font14Regular" textAlign="center">
              {t('dashBoard.add_device')}
            </Text>
          </Button>

          {currentUserData?.devices?.slice(0, 2).map((deviceWrapper, index) => {
            return (
              <Button
                flexGrow={
                  currentUserData?.devices?.length === 1
                    ? 0.3
                    : currentUserData?.devices?.length === 2
                    ? 0.7
                    : 1
                }
                elevation={5}
                alignItems="center"
                bg="graphite_to_pearl"
                justifyContent="center"
                width={DEVICE_BOX_DIMENSIONS}
                height={DEVICE_BOX_DIMENSIONS}
                key={deviceWrapper.device.deviceName + index}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                onPress={() => navigation.navigate('Device', { device: deviceWrapper })}
              >
                <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="DeviceIcon" />

                <Text
                  px="xs"
                  textAlign="center"
                  variant="font14Regular"
                  color="ivory_to_charcoal"
                >
                  {deviceWrapper.device.deviceName}
                </Text>
              </Button>
            )
          })}

          {Array.from({
            length: Math.max(0, 2 - (currentUserData?.devices?.length || 0)),
          }).map((_, i) => {
            return <Box key={`empty-first-${i}`} width={DEVICE_BOX_DIMENSIONS} />
          })}

          {currentUserData?.devices &&
            currentUserData.devices
              .slice(2)
              .reduce((acc: (typeof currentUserData.devices)[], device, index) => {
                if (index % 3 === 0) acc.push([])
                acc[acc.length - 1].push(device)

                return acc
              }, [])
              .map((row, rowIndex) => (
                <Box
                  gap="sm"
                  key={rowIndex}
                  flexDirection="row"
                  justifyContent="space-between"
                  flexGrow={row.length === 1 ? 0.3 : row.length === 2 ? 0.7 : 1}
                >
                  {row.map((deviceWrapper, index) => {
                    return (
                      <Button
                        flexGrow={1}
                        elevation={5}
                        alignItems="center"
                        bg="graphite_to_pearl"
                        justifyContent="center"
                        width={DEVICE_BOX_DIMENSIONS}
                        height={DEVICE_BOX_DIMENSIONS}
                        key={deviceWrapper.device.deviceName + index}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                        onPress={() =>
                          navigation.navigate('Device', { device: deviceWrapper })
                        }
                      >
                        <ThemeIcon color="ivory_to_charcoal" mb="xs" icon="DeviceIcon" />

                        <Text
                          px="xs"
                          textAlign="center"
                          variant="font14Regular"
                          color="ivory_to_charcoal"
                        >
                          {deviceWrapper.device.deviceName}
                        </Text>
                      </Button>
                    )
                  })}

                  {Array.from({ length: 3 - row.length }).map((_, i) => {
                    return (
                      <Box key={`empty-${rowIndex}-${i}`} width={DEVICE_BOX_DIMENSIONS} />
                    )
                  })}
                </Box>
              ))}
        </Box>
      </Box>
    </Screen>
  )
}

export default DashboardScreen
