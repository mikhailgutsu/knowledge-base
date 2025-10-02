import React from 'react'
import { FlatList as RNFlatList } from 'react-native'

import { useTranslation } from 'react-i18next'
import { useNotificationData } from 'src/hooks/device-management'
import { type DrawerNavigationProp } from '@react-navigation/drawer'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import {
  Box,
  Text,
  Button,
  Screen,
  Divider,
  FlatList,
  ThemeIcon,
} from '@components/atoms'
import { useTheme } from '@theme/useTheme'

import type { LoggedInStackParamList } from '@navigation/stacks/logged-in/logged-in.types'

interface INotification {
  at: string
  type: string
  image: string
  serialNumber: string
}

const Notifications: React.FC = () => {
  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const navigation = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const { spacing } = useTheme()

  const { t } = useTranslation()

  const { fetchNotificationData, currentNotificationData } = useNotificationData()

  const flatListRef = React.useRef<RNFlatList<INotification> | null>(null)

  useFocusEffect(
    React.useCallback(() => {
      fetchNotificationData()
    }, [])
  )

  const sortedItems = React.useMemo(
    () =>
      currentNotificationData.sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      ),
    [currentNotificationData]
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
      const icon =
        item.type === 'accepded'
          ? 'AcceptIcon'
          : item.type === 'declined'
          ? 'DeclineIcon'
          : 'MissedIcon'

      const formattedDate = formattedSortedItems[index].formattedDate

      return (
        <Box mx="md">
          <Divider my="sm" color="silverstone" />
          <Box key={index} alignItems="center" flexDirection="row">
            <ThemeIcon icon={icon} color="ivory_to_steel" />

            <Box ml="sm">
              <Text variant="font14Regular" color="ivory_to_steel">
                Front door, {formattedDate}
              </Text>

              <Text color="secondary" variant="font14Regular" textTransform="uppercase">
                {item.type} ring from intercom {item.serialNumber}
              </Text>
            </Box>
          </Box>
        </Box>
      )
    },
    [formattedSortedItems]
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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack()
            } else {
              navigation.navigate('Dashboard')
            }
          }}
        >
          <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
        </Button>

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />

        <Button onPress={navigation.openDrawer}>
          <ThemeIcon icon="MenuIcon" color="charcoal_to_ivory" />
        </Button>
      </Box>

      <Box mt="lg">
        <Text variant="font28Bold" textAlign="center" color="secondary">
          {t('notifications.notifications')}
        </Text>
      </Box>

      {!currentNotificationData.length ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Text px="md" variant="font24Bold" color="secondary" textAlign="center">
            {t('activity.you_havent_any_notification_yet')}
          </Text>
        </Box>
      ) : (
        <FlatList
          ref={flatListRef}
          renderItem={renderItem}
          decelerationRate={'fast'}
          snapToAlignment={'center'}
          data={currentNotificationData}
          style={{ marginBottom: spacing.md }}
        />
      )}
    </Screen>
  )
}

export default Notifications
