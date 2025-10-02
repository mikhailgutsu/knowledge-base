import React from 'react'
import { ActivityIndicator } from 'react-native'

import Canvas from 'react-native-canvas'

import {
  useEventCallDenied,
  useEventCallMissed,
  useEventCallAccepted,
} from 'src/hooks/event-management'
import { Theme } from '@theme/index'
import { useTheme } from '@theme/useTheme'
import { removeStorageItem } from '@storage'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useAppStateStatus, useRemoveHardwareBackHandler } from '@hooks'
import {
  exitApp,
  missedCall,
  isScreenLocked,
  cancelNotification,
} from '@firebase/video-streaming-notifications/helpers'
import { useToast } from 'react-native-toast-notifications'

import { CanvasRenderer } from './CanvasRenderer'
import { WebSocketService } from './WebSocketService'

import {
  Box,
  Text,
  Button,
  Screen,
  ThemeIcon,
  type Icon,
  BackgroundLines,
  type ButtonProps,
} from '@components/atoms'

import { OS } from 'src/constants'

import type {
  LoggedInStackParamList,
  LoggedInStackScreenProps,
} from '@navigation/stacks/logged-in/logged-in.types'
import type { DrawerNavigationProp } from '@react-navigation/drawer'

interface IActionButtonProps extends ButtonProps {
  icon: Icon
  label?: string
  onPress: () => void
  fill?: keyof Theme['colors']
  color?: keyof Theme['colors']
}

const ActionButton: React.FC<IActionButtonProps> = (props) => {
  const { onPress, icon, label, color, fill, ...buttonProps } = props

  return (
    <Button onPress={onPress} alignSelf="center" elevation={5} {...buttonProps}>
      <ThemeIcon icon={icon} color={color} fill={fill} elevation={5} />
      {label && (
        <Text textAlign="center" color="secondary">
          {label}
        </Text>
      )}
    </Button>
  )
}

const Call: React.FC<LoggedInStackScreenProps<'Call'>> = (props) => {
  const { route } = props
  const { port, serialNumber } = route.params || {}

  const toast = useToast()

  if (!port) {
    console.log('No port provided')
    return ''
  }

  const { t } = useTranslation()
  const { isDarkTheme } = useTheme()
  const { appStateStatus } = useAppStateStatus()
  const { isHardwareBack } = useRemoveHardwareBackHandler({ type: true })
  const navigation = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const [aux1, setAux1] = React.useState(false)
  const [aux2, setAux2] = React.useState(false)
  const [seconds, setSeconds] = React.useState(0)
  const [openDoor, setOpenDoor] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)
  const [isBackground, setIsBackground] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [acceptHandler, setAcceptHandler] = React.useState(false)
  const [isCanvasVisible, setIsCanvasVisible] = React.useState(true)

  const canvasRef = React.useRef<Canvas | null>(null)
  const canvasRendererRef = React.useRef<CanvasRenderer | null>(null)

  const { fetchEventCallDenied } = useEventCallDenied()
  const { fetchEventCallMissed } = useEventCallMissed()
  const { fetchEventCallAccepted } = useEventCallAccepted()

  const wsServiceRef = React.useRef<WebSocketService>(
    new WebSocketService(`ws://185.181.228.243:${port}`, {
      onFrameReceived: (imageData) => {
        if (
          canvasRendererRef.current &&
          isCanvasVisible &&
          acceptHandler &&
          !isBackground
        ) {
          requestAnimationFrame(() => {
            canvasRendererRef.current?.render(imageData)
          })
        }
      },
      onError: (error) => {
        console.error('WebSocket Error:', error)
        setIsConnected(false)
      },
      onConnectionChange: (connected) => {
        // console.log('Connection state changed:', connected)
        setIsConnected(connected)
      },
    })
  )

  const sendMessage = (message: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.send(message)
    } else {
      console.warn('WebSocket connection is not available.')
    }
  }

  React.useEffect(() => {
    const missedCallTimer = setTimeout(async () => {
      if (!acceptHandler) {
        await removeStorageItem('port')
        handleDeclineInitializedCall()
        if (OS === 'ios') fetchEventCallMissed(serialNumber)
        missedCall()
        handleBackNavigation()
      }
    }, 30000)

    return () => {
      clearTimeout(missedCallTimer)
    }
  }, [acceptHandler])

  const handleAcceptCall = React.useCallback(async () => {
    // console.log('Accept call triggered')

    await fetchEventCallAccepted(serialNumber)

    setAcceptHandler(true)
    await removeStorageItem('port')

    if (wsServiceRef.current) {
      wsServiceRef.current.connect()

      setTimeout(() => {
        // console.log('Sending answer_call message')
        wsServiceRef.current?.send('answer_call')
      }, 1000)
    }
  }, [])

  const handleBackNavigation = () => {
    if (OS === 'android') {
      isScreenLocked().then((isLocked) => {
        if (isLocked && isHardwareBack) {
          cancelNotification(1)
          // if app was isLocked - kill app
          exitApp()
        } else {
          if (navigation.canGoBack()) {
            // if app was forebround | background
            return navigation.goBack()
          } else {
            // if app was killed, navigate to dashboard
            return navigation.navigate('Dashboard')
          }
        }
      })
    }

    if (OS === 'ios') {
      if (navigation.canGoBack()) {
        // if app was forebround | background
        return navigation.goBack()
      } else {
        // if app was killed, navigate to dashboard
        return navigation.navigate('Dashboard')
      }
    }
  }

  const handleDeclineCall = async () => {
    fetchEventCallDenied(serialNumber)

    await removeStorageItem('port')

    setTimeout(() => {
      if (wsServiceRef.current) {
        wsServiceRef.current.connect()
      }
    }, 1000)

    setTimeout(() => {
      sendMessage('deny_call')
    }, 1200)

    setTimeout(() => {
      if (
        wsServiceRef.current?.socket &&
        wsServiceRef.current?.socket.readyState === WebSocket.OPEN
      ) {
        wsServiceRef.current.close()
      } else {
        console.log('WebSocketService is not initialized.')
      }
    }, 1500)

    handleBackNavigation()
  }

  const handleDeclineInitializedCall = async () => {
    setTimeout(() => {
      sendMessage('deny_call')
    }, 1200)

    setTimeout(() => {
      if (
        wsServiceRef.current?.socket &&
        wsServiceRef.current?.socket.readyState === WebSocket.OPEN
      ) {
        wsServiceRef.current.close()
      } else {
        console.log('WebSocketService is not initialized.')
      }
    }, 1500)

    handleBackNavigation()
  }

  const handleOpenDoor = () => {
    sendMessage('open_door')
    setOpenDoor((prevState) => !prevState)

    if (wsServiceRef.current) {
      wsServiceRef.current.close()
    } else {
      console.warn('WebSocketService is not initialized.')
    }

    handleBackNavigation()
  }

  React.useEffect(() => {
    if (canvasRef.current && !canvasRendererRef.current) {
      // console.log('Initializing canvas renderer')
      canvasRendererRef.current = new CanvasRenderer(canvasRef.current)
    }

    return () => {
      if (canvasRendererRef.current) {
        // console.log('Cleaning up canvas renderer')
        canvasRendererRef.current.clear()
        canvasRendererRef.current = null
      }
    }
  }, [])

  React.useEffect(() => {
    // console.log(`App state changed to: ${appStateStatus}`)
    const isInBackground = appStateStatus !== 'active'
    setIsBackground(isInBackground)

    if (wsServiceRef.current) {
      wsServiceRef.current.setBackgroundState(isInBackground)
    }
  }, [appStateStatus])

  React.useEffect(() => {
    if (acceptHandler && !isBackground) {
      // console.log('Accept handler triggered, initializing connection...')

      if (!canvasRendererRef.current && canvasRef.current) {
        // console.log('Initializing canvas renderer')
        canvasRendererRef.current = new CanvasRenderer(canvasRef.current)
      }

      if (wsServiceRef.current && !isConnected) {
        // console.log('Connecting WebSocket after accept')
        wsServiceRef.current.connect()
      }
    }
  }, [acceptHandler, isBackground])

  React.useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1)
    }, 1000)

    if (!canvasRef.current) {
      console.warn('Canaddvas is not initialized')
      return
    }

    canvasRendererRef.current = new CanvasRenderer(canvasRef.current)

    wsServiceRef.current = new WebSocketService(`ws://185.181.228.243:${port}`, {
      onFrameReceived: (imageData) => {
        canvasRendererRef.current?.render(imageData)
      },
      onError: (error) => console.error('WebSocket Error:', error),
    })

    return () => {
      clearInterval(timer)
      clearTimeout(loaderTimer)

      if (wsServiceRef.current) {
        wsServiceRef.current.close()
      }
    }
  }, [port])

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="charcoal_to_white"
      statusBarStyle={isDarkTheme ? 'light-content' : 'dark-content'}
    >
      <BackgroundLines />

      <Box flex={1} justifyContent="space-between">
        <Box flex={1}>
          {!acceptHandler ? (
            <Box height={48} justifyContent="center" zIndex={isCanvasVisible ? 1 : -1}>
              <Text textAlign="center" variant="font18Regular" color="secondary">
                {t('call.incoming_call')}
              </Text>

              <Text textAlign="center" variant="font16Regular" color="secondary">
                {t('call.door')}
              </Text>
            </Box>
          ) : (
            <Box height={48} justifyContent="center" zIndex={isCanvasVisible ? 1 : -1}>
              <Text textAlign="center" variant="font18Regular" color="secondary">
                {t('call.door_uppercase')}
              </Text>
            </Box>
          )}

          <Box flex={1} position="relative">
            <Box
              top={0}
              left={0}
              flex={1}
              right={0}
              bottom={0}
              alignItems="center"
              position="absolute"
              justifyContent="center"
              opacity={isCanvasVisible ? 1 : 0}
            >
              {/* @ts-ignore */}
              <Canvas
                ref={(canvas: Canvas | null) => (canvasRef.current = canvas)}
                onCanvasReady={(canvas) => {
                  if (canvas) {
                    canvasRef.current = canvas
                    if (!canvasRendererRef.current) {
                      canvasRendererRef.current = new CanvasRenderer(canvas)
                      wsServiceRef.current?.setOnFrameReceived((imageData) => {
                        canvasRendererRef.current?.render(imageData)
                      })
                    }
                  }
                }}
              />
            </Box>
            <Box
              top={0}
              left={0}
              flex={1}
              right={0}
              bottom={0}
              position="absolute"
              alignItems="center"
              justifyContent="center"
              opacity={isCanvasVisible ? 0 : 1}
            >
              <ThemeIcon icon="HomeIcon" />

              {!acceptHandler ? (
                <Box mt="md">
                  <Text textAlign="center" variant="font18Regular" color="secondary">
                    {t('call.incoming_call')}
                  </Text>

                  <Text textAlign="center" variant="font16Regular" color="secondary">
                    {t('call.door')}
                  </Text>
                </Box>
              ) : (
                <Box mt="md">
                  <Text textAlign="center" variant="font18Regular" color="secondary">
                    {t('call.door_uppercase')}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            left={0}
            right={0}
            bottom={0}
            height={20}
            position="absolute"
            justifyContent="center"
          >
            {acceptHandler && (
              <Text textAlign="center" color="secondary">{`${String(
                Math.floor(seconds / 60)
              ).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`}</Text>
            )}
          </Box>
        </Box>

        {!acceptHandler && (
          <Box flex={1} justifyContent="space-between">
            <ActionButton
              onPress={() => {
                setIsCanvasVisible((prevState) => !prevState)
              }}
              icon={isCanvasVisible ? 'VideoOpenIcon' : 'VideoCloseIcon'}
              fill={isCanvasVisible ? 'pearl_to_cerulean' : 'graphite_to_pearl'}
              color={isCanvasVisible ? 'graphite_to_pearl' : 'pearl_to_graphite'}
            />

            <Box justifyContent="space-between" flexDirection="row" px="md" pb="sm">
              <ActionButton
                icon="AcceptCallIcon"
                label={t('call.accept')}
                onPress={handleAcceptCall}
              />
              <ActionButton
                icon="DeclineCallIcon"
                label={t('call.decline')}
                onPress={handleDeclineCall}
              />
            </Box>
          </Box>
        )}

        {acceptHandler && isLoading && (
          <Box flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator color="white" />
          </Box>
        )}

        {acceptHandler && !isLoading && (
          <Box flex={1}>
            <Box flexDirection="row" justifyContent="center">
              <ActionButton
                onPress={() => {
                  sendMessage('micro')
                  toast.show('Micro is currently unavailable', { type: 'warning' })
                }}
                icon="MicroCloseIcon"
                fill="graphite_to_pearl"
                color="pearl_to_graphite"
              />

              <ActionButton
                onPress={() => {
                  setIsCanvasVisible((prevState) => !prevState)
                }}
                icon={isCanvasVisible ? 'VideoOpenIcon' : 'VideoCloseIcon'}
                fill={isCanvasVisible ? 'pearl_to_cerulean' : 'graphite_to_pearl'}
                color={isCanvasVisible ? 'graphite_to_pearl' : 'pearl_to_graphite'}
              />

              <ActionButton
                onPress={() => {
                  sendMessage('audio')
                  toast.show('Audio is currently unavailable', { type: 'warning' })
                }}
                icon="AudioCloseIcon"
                fill="graphite_to_pearl"
                color="pearl_to_graphite"
              />
            </Box>

            <ActionButton
              flex={1}
              pt="xs"
              onPress={() => {
                sendMessage('aux1')
                // setAux1((prevState) => !prevState)
                toast.show('AUX 1 is currently unavailable', { type: 'warning' })
              }}
              icon="Aux1Icon"
              label={t('call.aux1')}
              fill={aux1 ? 'cerulean' : 'pearl_to_slate'}
              color={aux1 ? 'pearl' : 'pearl_to_graphite'}
            />

            <Box flexDirection="row" justifyContent="space-between" px="md" pb="sm">
              <ActionButton
                icon="OpenDoorIcon"
                fill={'pearl_to_slate'}
                onPress={handleOpenDoor}
                label={t('call.open_door')}
                color={'pearl_to_graphite'}
              />

              <ActionButton
                onPress={() => {
                  sendMessage('aux2')
                  // setAux2((prevState) => !prevState)
                  toast.show('AUX 2 is currently unavailable', { type: 'warning' })
                }}
                icon="Aux2Icon"
                label={t('call.aux2')}
                fill={aux2 ? 'cerulean' : 'pearl_to_slate'}
                color={aux2 ? 'pearl' : 'pearl_to_graphite'}
              />

              <ActionButton
                icon="DeclineCallIcon"
                label={t('call.decline')}
                onPress={handleDeclineInitializedCall}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Screen>
  )
}

export default Call
