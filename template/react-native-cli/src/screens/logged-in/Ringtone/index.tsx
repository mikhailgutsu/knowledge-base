import React from 'react'
import { StyleSheet } from 'react-native'

import { useSound } from '@hooks'
import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'

import { Box, Text, Button, Screen, FlatList, ThemeIcon } from '@components/atoms'

import { WIDTH } from 'src/constants'

import type { INotificationSound } from 'src/hooks/native-modules/useSound'

const RingtoneScreen: React.FC = () => {
  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const {
    sounds,
    playing,
    selected,
    navigation,
    goBackHandler,
    currentRingtone,
    handlePlaySound,
    handlerToSaveRingtone,
  } = useSound()

  const renderItem = React.useCallback(
    ({ index, item }: { item: INotificationSound; index: number }) => {
      const isSelected = selected === index
      const isPlaying = playing?.soundID === item.soundID

      return (
        <Button
          mx="md"
          mb="sm"
          px="sm"
          py="sm"
          key={index}
          borderWidth={1}
          alignItems="center"
          flexDirection="row"
          onPress={() => handlePlaySound(item, index)}
          borderColor={isSelected ? 'cerulean' : 'silverstone'}
        >
          <ThemeIcon
            icon={isPlaying ? 'PauseIcon' : 'PlayIcon'}
            color={isSelected ? 'cerulean' : 'ivory_to_steel'}
          />

          <Box ml="sm" flexDirection="row" justifyContent="space-between" flex={1}>
            <Text
              variant="font14Regular"
              color={isSelected ? 'cerulean' : 'ivory_to_steel'}
            >
              {item.title}
            </Text>
            {currentRingtone?.soundID === item.soundID && (
              <ThemeIcon icon="ValidIcon" color="cerulean" />
            )}
          </Box>
        </Button>
      )
    },
    [selected, playing, currentRingtone]
  )

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
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
          onPress={goBackHandler}
        >
          <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
        </Button>

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />

        <Button onPress={navigation.openDrawer}>
          <ThemeIcon icon="MenuIcon" color="charcoal_to_ivory" />
        </Button>
      </Box>

      <Box my="lg">
        <Text
          color="secondary"
          textAlign="center"
          variant={WIDTH < 375 ? 'font24Bold' : 'font28Bold'}
        >
          {t('ringtone.change_ringtone')}
        </Text>
      </Box>

      <FlatList
        data={sounds}
        renderItem={renderItem}
        style={styles.flatList}
        decelerationRate="fast"
        snapToAlignment="center"
      />

      <Button
        mx="md"
        mb="md"
        height={48}
        bg="cerulean"
        alignItems="center"
        justifyContent="center"
        onPress={() => handlerToSaveRingtone(playing?.url)}
      >
        <Text variant="font16Regular" color="white">
          {t('actions.save')}
        </Text>
      </Button>
    </Screen>
  )
}

const styles = StyleSheet.create({ flatList: { marginBottom: 24 } })

export default RingtoneScreen
