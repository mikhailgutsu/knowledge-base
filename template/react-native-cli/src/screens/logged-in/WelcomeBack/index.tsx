import React from 'react'
import { t } from 'i18next'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { useTheme } from '@theme/useTheme'
import { useFocusEffect } from '@react-navigation/native'
import { useCurrentUser, useDefaultRingtone } from '@hooks'

import { Box, Text, Button, Image, Screen, ThemeIcon } from '@components/atoms'

import { AVATAR_SIZE } from 'src/constants'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

const WelcomeBackScreen: React.FC<LoggedInStackScreenProps<'WelcomeBack'>> = (props) => {
  const { navigation } = props

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'light-content' : 'dark-content'

  const {
    currentUserData,
    currentUserAvatar,
    fetchCurrentUserData,
    loadingCurrentUserData,
  } = useCurrentUser()

  const { getDefaultRingtone } = useDefaultRingtone()

  useFocusEffect(
    React.useCallback(() => {
      getDefaultRingtone()
      fetchCurrentUserData()
    }, [])
  )

  return (
    <Screen
      p="md"
      bg="charcoal_to_white"
      statusColor="charcoal_to_white"
      statusBarStyle={statusBarStyle}
    >
      <Box flex={1} justifyContent="space-between">
        {loadingCurrentUserData && <ActivityIndicator size="large" color="white" />}

        {!loadingCurrentUserData && (
          <React.Fragment>
            <Box mt="md" />

            <Box
              alignSelf="center"
              alignItems="center"
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              justifyContent="center"
              borderRadius={AVATAR_SIZE}
            >
              <ThemeIcon
                position="absolute"
                fill="charcoal_to_ivory"
                color="silver_to_steel"
                icon="LogoDecorativeCircleIcon"
              />

              {currentUserAvatar ? (
                <Image
                  resizeMode="cover"
                  style={styles.avatar}
                  source={{ uri: currentUserAvatar }}
                />
              ) : (
                <Box
                  bg="cerulean"
                  alignItems="center"
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  justifyContent="center"
                  borderRadius={AVATAR_SIZE}
                >
                  <ThemeIcon icon="UserIcon" width={129} height={129} strokeWidth={1} />
                </Box>
              )}
            </Box>
          </React.Fragment>
        )}

        <Box mt="xl">
          <Text variant="font28Bold" color="secondary" textAlign="center">
            {t('welcomeBack.hello')} {currentUserData?.fullName ?? 'USER'}!
          </Text>

          <Text
            mt="md"
            textAlign="center"
            variant="font14Medium"
            color="silverstone_to_steel"
          >
            {t('welcomeBack.welcome_back')}
          </Text>
        </Box>

        <Button
          height={48}
          bg="cerulean"
          alignItems="center"
          justifyContent="center"
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text variant="font16Regular" color="white">
            {t('welcomeBack.get_started')}
          </Text>
        </Button>
      </Box>
    </Screen>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
  },
})

export default WelcomeBackScreen
