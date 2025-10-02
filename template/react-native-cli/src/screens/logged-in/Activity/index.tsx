import React from 'react'
import { FlatList as RNFlatList, StyleSheet } from 'react-native'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import { type DrawerNavigationProp } from '@react-navigation/drawer'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useNotificationPerDeviceData } from 'src/hooks/device-management'

import { Box, Text, Image, Button, Screen, FlatList, ThemeIcon } from '@components/atoms'

import type {
  LoggedInStackParamList,
  LoggedInStackScreenProps,
} from '@navigation/stacks/logged-in/logged-in.types'

interface INotification {
  at: string
  type: string
  image: string
  serialNumber: string
}

const ActivityScreen: React.FC<LoggedInStackScreenProps<'Activity'>> = (props) => {
  const { navigation, route } = props

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const navigationDrawer = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const { fetchNotificationPerDeviceData, currentNotificationPerDeviceData } =
    useNotificationPerDeviceData()

  const flatListRef = React.useRef<RNFlatList<INotification> | null>(null)

  const [selected, setSelected] = React.useState<number | null>(null)

  const handleSelection = React.useCallback((id: number) => {
    setSelected((prev) => (prev === id ? null : id))
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      fetchNotificationPerDeviceData(route.params.device.serialNumber)
    }, [])
  )

  const sortedItems = React.useMemo(
    () =>
      currentNotificationPerDeviceData.sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      ),
    [currentNotificationPerDeviceData]
  )

  const formattedSortedItems = React.useMemo(() => {
    return sortedItems.map((item) => {
      const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
        .format(new Date(item.at + 'Z'))
        .replace(',', '')
        .replace(/\//g, '.')
      return { ...item, formattedDate }
    })
  }, [sortedItems])

  const renderItem = React.useCallback(
    ({ item, index }: { item: INotification; index: number }) => {
      const isSelected = selected === index

      const icon =
        item.type === 'accepded'
          ? 'AcceptIcon'
          : item.type === 'declined'
          ? 'DeclineIcon'
          : 'MissedIcon'

      const formattedDate = formattedSortedItems[index].formattedDate

      return (
        <Box
          mx="md"
          mb="sm"
          px="sm"
          py="xs"
          borderWidth={1}
          bg="charcoal_to_ivory"
          borderColor="silverstone"
        >
          <Button
            mb="xs"
            key={index}
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            onPress={() => handleSelection(index)}
          >
            <Box alignItems="center" flexDirection="row">
              <ThemeIcon icon={icon} color="ivory_to_steel" />

              <Box ml="sm">
                <Text variant="font14Regular" color="ivory_to_steel">
                  Front door, {formattedDate}
                </Text>

                <Text color="secondary" variant="font14Regular" textTransform="uppercase">
                  {item.type} ring
                </Text>
              </Box>
            </Box>

            <ThemeIcon
              color="silverstone"
              icon={isSelected ? 'ChevronBottomIcon' : 'ChevronRightIcon'}
            />
          </Button>

          {isSelected && (
            <Image
              resizeMode="cover"
              source={{
                uri: `data:image/jpeg;base64,${item.image}`,
              }}
              style={{ height: 200, flex: 1 }}
            />
          )}
        </Box>
      )
    },
    [selected, handleSelection, formattedSortedItems]
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

      <Box my="lg">
        <Text variant="font28Bold" textAlign="center" color="secondary">
          {t('activity.my_activity')}
        </Text>
      </Box>

      {!currentNotificationPerDeviceData.length ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Text px="md" variant="font24Bold" color="secondary" textAlign="center">
            {t('activity.you_havent_any_notification_yet')}
          </Text>
        </Box>
      ) : (
        <FlatList
          ref={flatListRef}
          renderItem={renderItem}
          style={styles.flatList}
          decelerationRate="fast"
          snapToAlignment="center"
          data={currentNotificationPerDeviceData}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 200,
  },
  flatList: {
    marginBottom: 24,
  },
})

export default ActivityScreen
