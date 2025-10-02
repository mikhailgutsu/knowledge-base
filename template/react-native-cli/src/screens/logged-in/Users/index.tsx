import React from 'react'

import { useShowAlert } from '@hooks'
import { getStorageItem } from '@storage'
import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import {
  useDeviceData,
  useDeviceDeleteUser,
  useDeviceUpdateRole,
} from 'src/hooks/device-management'
import { useToast } from 'react-native-toast-notifications'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useIsFocused, useNavigation } from '@react-navigation/native'

import {
  Box,
  Text,
  Screen,
  Button,
  Loader,
  Divider,
  FlatList,
  ThemeIcon,
} from '@components/atoms'

import type {
  LoggedInStackParamList,
  LoggedInStackScreenProps,
} from '@navigation/stacks/logged-in/logged-in.types'
import type { ICurrentUserResponse, IUserGroup } from '@typings/user'

const UsersScreen: React.FC<LoggedInStackScreenProps<'Users'>> = (props) => {
  const { navigation, route } = props

  const { device, userRole } = route.params.device

  const toast = useToast()

  const { t } = useTranslation()

  const showAlert = useShowAlert()

  const isFocused = useIsFocused()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const { fetchDeviceUpdateRole, loadingDeviceUpdateRole } = useDeviceUpdateRole()
  const { fetchDeviceData, currentDeviceData } = useDeviceData(device.serialNumber)
  const { fetchDeviceDeleteUserData, loadingDeviceDeleteUserData } = useDeviceDeleteUser()

  const navigationDrawer = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const [selectedUser, setSelectedUser] = React.useState<number | null>(null)
  const [currentUser, setCurrentUser] = React.useState<ICurrentUserResponse | null>(null)

  const getCurrentUserData = async () => {
    const currentUserStorage = await getStorageItem<ICurrentUserResponse>('currentUser')

    if (currentUserStorage) {
      setCurrentUser(currentUserStorage)
    }
  }

  React.useEffect(() => {
    if (isFocused) {
      fetchDeviceData()
      getCurrentUserData()
    }
  }, [isFocused])

  const handleUserSelection = React.useCallback((id: number) => {
    setSelectedUser((prev) => (prev === id ? null : id))
  }, [])

  const handleToggleRole = (item: Omit<IUserGroup, 'fullName'>) => {
    showAlert({
      cancelable: true,
      cancelText: t('actions.close'),
      title: t('users.show_alert_change_role_title'),
      onPressText: t('users.show_alert_change_role_title'),
      message: `${t('users.show_alert_change_role_message')} ${
        item.second === 'DEVICE_OWNER' ? 'USER' : 'ADMIN'
      }? `,

      onPress: async () => {
        await fetchDeviceUpdateRole({
          email: item.first.first,
          serialNumber: device.serialNumber,
          newRole: item.second === 'DEVICE_OWNER' ? 'DEVICE_VIEWER' : 'DEVICE_OWNER',
        })
      },
    })
  }

  const handleRemoveUserFromGroup = (item: Pick<IUserGroup, 'first'>) => {
    showAlert({
      cancelable: true,
      cancelText: t('actions.close'),
      onPressText: t('actions.delete'),
      title: t('users.show_alert_remove_user_title'),
      message: `${t('users.show_alert_remove_user_message')} ${item.first.second}?`,
      onPress: async () => {
        await fetchDeviceDeleteUserData({
          email: item.first.first,
          serialNumber: device.serialNumber,
        })
      },
    })
  }

  const sortedDeviceData = React.useMemo(() => {
    if (!currentDeviceData) return []

    return [...currentDeviceData.users].sort((a, b) => {
      if (a.second === 'DEVICE_OWNER' && b.second === 'DEVICE_VIEWER') {
        return -1
      }
      if (a.second === 'DEVICE_VIEWER' && b.second === 'DEVICE_OWNER') {
        return 1
      }
      return 0
    })
  }, [currentDeviceData])

  const { admins } = React.useMemo(() => {
    const admins =
      currentDeviceData?.users.filter((user) => user.second === 'DEVICE_OWNER') ?? []
    return { admins }
  }, [currentDeviceData])

  const adminCount = admins.length

  const currentUserEmail = currentUser?.email ?? ''

  const isCurrentUser = (email: string) => email === currentUserEmail

  const renderUser = React.useCallback(
    ({ item, index }: { item: IUserGroup; index: number }) => {
      const isSelected = selectedUser === index
      const isDeviceUser = userRole === 'DEVICE_VIEWER'

      const isCurrentUserAdmin = userRole === 'DEVICE_OWNER'
      const isLastAdmin = isCurrentUserAdmin && adminCount <= 1
      const isCurrent = isCurrentUser(item.first.first)

      const canManageUser = !(isLastAdmin && isCurrent)
      return (
        <Box px="md">
          <Text
            mb="xs"
            variant="font16Regular"
            color="slate_to_charcoal"
            textTransform="uppercase"
          >
            {item.second === 'DEVICE_VIEWER' ? t('users.user') : t('users.admin')}
          </Text>

          <Button
            px="sm"
            height={48}
            borderWidth={1}
            flexDirection="row"
            alignItems="center"
            bg="graphite_to_pearl"
            borderColor="silverstone"
            justifyContent="space-between"
            onPress={() => handleUserSelection(index)}
            disabled={isDeviceUser || !canManageUser || isCurrentUser(item.first.first)}
          >
            <Text variant="font14Regular" color="ivory_to_steel">
              {item.first.second}
            </Text>
            {!isDeviceUser && canManageUser && !isCurrentUser(item.first.first) && (
              <ThemeIcon
                color="silverstone"
                icon={isSelected ? 'ChevronBottomIcon' : 'ChevronRightIcon'}
              />
            )}
          </Button>

          {isSelected && (
            <Box mt="sm" height={48} flexDirection="row" justifyContent="space-between">
              <Button
                flex={1}
                bg="cerulean"
                alignItems="center"
                justifyContent="center"
                disabled={loadingDeviceUpdateRole}
                onPress={() => handleToggleRole(item)}
              >
                <Text variant="font16Regular" color="white" textAlign="center">
                  {t('users.set_as')}{' '}
                  {item.second === 'DEVICE_OWNER' ? t('users.user') : t('users.admin')}
                </Text>
                <Loader loading={loadingDeviceUpdateRole} />
              </Button>

              <Button
                flex={1}
                marginLeft="sm"
                borderWidth={1}
                alignItems="center"
                borderColor="error"
                justifyContent="center"
                bg={statusBarStyle === 'light-content' ? 'red' : 'transparent'}
                disabled={loadingDeviceDeleteUserData}
                onPress={() => handleRemoveUserFromGroup(item)}
              >
                <Text variant="font16Regular" color="error">
                  {t('users.remove')}
                </Text>
                <Loader loading={loadingDeviceDeleteUserData} />
              </Button>
            </Box>
          )}

          <Divider my="sm" color="silverstone" />
        </Box>
      )
    },
    [selectedUser, handleUserSelection, adminCount]
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
          onPress={navigation.goBack}
        >
          <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
        </Button>

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />

        <Button onPress={navigationDrawer.openDrawer}>
          <ThemeIcon icon="MenuIcon" color="charcoal_to_ivory" />
        </Button>
      </Box>

      <Text mt="lg" variant="font24Bold" textAlign="center" color="secondary">
        {t('users.users')}
      </Text>

      <Box flex={1} justifyContent="space-between">
        <FlatList
          data={sortedDeviceData}
          renderItem={renderUser}
          decelerationRate="fast"
          snapToAlignment="center"
        />

        <Box>
          <Button
            mb="md"
            mt="xs"
            mx="md"
            height={48}
            borderWidth={1}
            paddingLeft="sm"
            alignItems="center"
            flexDirection="row"
            borderColor="silverstone"
            onPress={() => {
              if (userRole === 'DEVICE_VIEWER') {
                toast.show(t('users.dont_have_permissions'), { type: 'danger' })
              } else {
                navigation.navigate('InvitationViaEmail', { device })
              }
            }}
          >
            <ThemeIcon icon="PlusIcon" color="ivory_to_steel" />

            <Text variant="font16Regular" color="ivory_to_steel" paddingLeft="sm">
              {t('users.add_in_group')}
            </Text>
          </Button>
        </Box>
      </Box>
    </Screen>
  )
}

export default UsersScreen
