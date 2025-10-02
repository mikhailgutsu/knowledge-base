import React from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList as RNFlatList,
} from 'react-native'
import { type Source } from 'react-native-fast-image'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'

import { Language } from '@components/molecules'
import { Box, Button, FlatList, Image, Screen, Text, ThemeIcon } from '@components/atoms'

import { WIDTH } from 'src/constants'

import type { LoggedOutStackScreenProps } from '@navigation/stacks/logged-out/logged-out.types'

interface SlideItem {
  text: string
  image: Source
  title: string
}

const IntroSlideScreen: React.FC<LoggedOutStackScreenProps<'IntroSlide'>> = (props) => {
  const { navigation } = props

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'light-content' : 'dark-content'

  const [activeSlide, setActiveSlide] = React.useState<number>(0)
  const flatListRef = React.useRef<RNFlatList<SlideItem> | null>(null)

  const slides: SlideItem[] = React.useMemo(
    () => [
      {
        text: '',
        image: null,
        title: t('slides.select_language'),
      },
      {
        text: t('slides.manage_video_call'),
        image: require('@assets/png/intercom.png'),
        title: t('slides.welcome_to_smart_intercom'),
      },
      {
        title: t('slides.monitor_door_in_real_time'),
        image: require('@assets/png/door-monitor.png'),
        text: t('slides.get_live_video_from_intercom'),
      },
    ],
    [t]
  )

  const renderItem = React.useCallback(
    ({ item, index }: { item: SlideItem; index: number }) => {
      if (index === 0) {
        return <Language />
      }

      return (
        <Box
          width={WIDTH}
          overflow="hidden"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Image
            source={item.image}
            resizeMode="contain"
            style={{
              width: 250,
              height: 250,
              marginLeft: 10,
            }}
          />

          <Box px="md">
            <Text variant="font24Bold" textAlign="center" mb="md" color="secondary">
              {item.title}
            </Text>

            <Text
              textAlign="center"
              variant="font14SemiBold"
              color="silverstone_to_steel"
            >
              {item.text}
            </Text>
          </Box>
        </Box>
      )
    },
    []
  )

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    )
    setActiveSlide && setActiveSlide(slideIndex)
  }

  const getItemLayout = (
    data: ArrayLike<SlideItem> | null | undefined,
    index: number
  ) => ({
    length: WIDTH,
    offset: WIDTH * index,
    index,
  })

  return (
    <Screen
      pb="md"
      bg="charcoal_to_white"
      statusColor="charcoal_to_white"
      statusBarStyle={statusBarStyle}
    >
      <FlatList
        horizontal
        data={slides}
        pagingEnabled
        ref={flatListRef}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        renderItem={renderItem}
        decelerationRate={'fast'}
        snapToAlignment={'center'}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={handleScroll}
        showsHorizontalScrollIndicator={false}
      />

      <Box mb="sm" flexDirection="row" alignSelf="center">
        {slides.map((_, index, array) => {
          const isFirstIndex = index === 0
          const isActiveSlide = index === activeSlide
          const isLastIndex = index === array.length - 1

          const isFirstActiveSlide = activeSlide === 0
          const isLastActiveSlide = activeSlide === array.length - 1

          const isSmallDot =
            (isLastIndex && isFirstActiveSlide) || (isFirstIndex && isLastActiveSlide)

          const smallDot = 6
          const simpleDot = 10
          const dotSize = isSmallDot ? smallDot : simpleDot

          return (
            <Box key={index} justifyContent="center" alignItems="center">
              <ThemeIcon
                mx="xs"
                key={index}
                width={isActiveSlide ? undefined : dotSize}
                height={isActiveSlide ? undefined : dotSize}
                icon={isActiveSlide ? 'DotActiveIcon' : 'DotIcon'}
              />
            </Box>
          )
        })}
      </Box>

      {activeSlide === 0 && (
        <Box
          gap="md"
          height={48}
          alignSelf="center"
          flexDirection="row"
          marginHorizontal="md"
        >
          <Button
            flex={1}
            borderWidth={1}
            alignItems="center"
            bg="charcoal_to_ivory"
            justifyContent="center"
            borderColor="ivory_to_steel"
            onPress={() => navigation.navigate('Login')}
          >
            <Text variant="font16SemiBold" color="ivory_to_steel">
              {t('actions.skip')}
            </Text>
          </Button>

          <Button
            mx="md"
            flex={1}
            height={48}
            bg="cerulean"
            alignItems="center"
            justifyContent="center"
            onPress={() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: 1 })
              }
              setActiveSlide(1)
            }}
          >
            <Text variant="font16SemiBold" color="white">
              {t('actions.next')}
            </Text>
          </Button>
        </Box>
      )}

      {activeSlide === 1 && (
        <Button
          height={48}
          bg="cerulean"
          alignItems="center"
          marginHorizontal="md"
          justifyContent="center"
          onPress={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: 2 })
            }
            setActiveSlide(2)
          }}
        >
          <Text variant="font16SemiBold" color="white">
            {t('slides.lets_start')}
          </Text>
        </Button>
      )}

      {activeSlide === 2 && (
        <Button
          mx="md"
          height={48}
          bg="cerulean"
          alignItems="center"
          justifyContent="center"
          onPress={() => navigation.navigate('Login')}
        >
          <Text variant="font16SemiBold" color="white">
            {t('actions.next')}
          </Text>
        </Button>
      )}
    </Screen>
  )
}

export default IntroSlideScreen
