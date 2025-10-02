import React from 'react'
import { format } from 'date-fns'
import RNFS from 'react-native-fs'
import { Modal } from 'react-native'
import Share from 'react-native-share'

import { useMount } from 'react-use'
import { useShowAlert } from '@hooks'
import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { type DrawerNavigationProp } from '@react-navigation/drawer'

import {
  Box,
  Text,
  Image,
  Button,
  Screen,
  Divider,
  FlatList,
  CheckBox,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import { OS, WIDTH } from 'src/constants'

import type {
  LoggedInStackParamList,
  LoggedInStackScreenProps,
} from '@navigation/stacks/logged-in/logged-in.types'

interface IImageList {
  id: number
  date: Date
  uri: string
}

const GalleryScreen: React.FC<LoggedInStackScreenProps<'Gallery'>> = (props) => {
  const { navigation, route } = props

  const navigationDrawer = useNavigation<DrawerNavigationProp<LoggedInStackParamList>>()

  const { t } = useTranslation()

  const showAlert = useShowAlert()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [isSelectionMode, setIsSelectionMode] = React.useState(false)
  const [isToggleOptionsDots, setIsToggleOptionsDots] = React.useState(false)
  const [isOpenedImageModalVisible, setIsOpenedImageModalVisible] = React.useState(false)

  const [imageDirectoryList, setDirectoryImageList] = React.useState<IImageList[]>([])

  const [selectedDates, setSelectedDates] = React.useState<string[]>([])
  const [selectedImages, setSelectedImages] = React.useState<number[]>([])

  const [openedImageURI, setOpenedImageURI] = React.useState<string | undefined>(
    undefined
  )

  useMount(async () => {
    try {
      const dirPath =
        OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath

      const directoryFiles = await RNFS.readDir(dirPath)

      const filtredDirectoryFiles = directoryFiles.filter((directoryFile) => {
        const { name } = directoryFile

        return name.startsWith(`ELECTRA_DEVICE_${route.params.device.serialNumber}_`)
      })

      const directoryImageList = filtredDirectoryFiles.map(
        (filtredDirectoryFile, index) => {
          const { path, mtime, ctime } = filtredDirectoryFile

          return {
            id: index,
            uri: `file://${path}`,
            date: new Date(mtime || ctime || Date.now()),
          }
        }
      )

      return setDirectoryImageList(directoryImageList)
    } catch (error) {
      console.error('Error loading images in useMount:', error)
    }
  })

  const groupImagesByDate = React.useCallback((groupImagesByDate: IImageList[]) => {
    return groupImagesByDate.reduce(
      (acc: Record<string, IImageList[]>, groupImageByDate) => {
        const formattedDate = format(groupImageByDate.date, 'dd.MM.yyyy')

        if (!acc[formattedDate]) {
          acc[formattedDate] = []
        }

        acc[formattedDate].push(groupImageByDate)

        return acc
      },
      {}
    )
  }, [])

  const groupedImagesByDate = React.useMemo(
    () => groupImagesByDate(imageDirectoryList),
    [imageDirectoryList]
  )

  const removeDateFromSelection = ({ date }: { date: string }) => {
    setSelectedDates((prevSelectedDatesState) => {
      return prevSelectedDatesState.filter((selectedDate) => {
        return selectedDate !== date
      })
    })
  }

  const handleSelectImage = ({ id, date }: { id: number; date: string }) => {
    return setSelectedImages((prevSelectedImagesState) => {
      const updatedSelectedImages = prevSelectedImagesState.includes(id)
        ? prevSelectedImagesState.filter((selectedImageID) => {
            return selectedImageID !== id
          })
        : [...prevSelectedImagesState, id]

      const allImagesForDateSelected = groupedImagesByDate[date].every(({ id }) => {
        return updatedSelectedImages.includes(id)
      })

      if (allImagesForDateSelected) {
        setSelectedDates((prevSelectedDatesState) => {
          if (!prevSelectedDatesState.includes(date)) {
            return [...prevSelectedDatesState, date]
          }

          return prevSelectedDatesState
        })
      } else {
        removeDateFromSelection({ date })
      }

      setIsSelectionMode(updatedSelectedImages.length > 0)
      setIsToggleOptionsDots(updatedSelectedImages.length > 0)

      return updatedSelectedImages
    })
  }

  const handleSelectAllImagesForDate = ({ date }: { date: string }) => {
    const imagesForSelectedDate = groupedImagesByDate[date]
    const imagesForSelectedDateByID = imagesForSelectedDate.map(({ id }) => id)

    return setSelectedImages((prevSelectedImagesState) => {
      let updatedSelectedImages: number[]

      if (selectedDates.includes(date)) {
        removeDateFromSelection({ date })

        updatedSelectedImages = prevSelectedImagesState.filter((selectedDateID) => {
          return !imagesForSelectedDateByID.includes(selectedDateID)
        })
      } else {
        setSelectedDates((prevSelectedDatesState) => [...prevSelectedDatesState, date])

        updatedSelectedImages = [...prevSelectedImagesState, ...imagesForSelectedDateByID]
      }

      setIsSelectionMode(updatedSelectedImages.length > 0)
      setIsToggleOptionsDots(updatedSelectedImages.length > 0)

      return updatedSelectedImages
    })
  }

  const handleOptionsDots = () => {
    setIsToggleOptionsDots((prevIsToggleDotsState) => !prevIsToggleDotsState)

    if (isSelectionMode) {
      setSelectedImages([])
      setSelectedDates([])
      return setIsSelectionMode(false)
    }

    return setIsSelectionMode(true)
  }

  const filterImagesById = React.useCallback(() => {
    return imageDirectoryList.filter(({ id }) => {
      return selectedImages.includes(id)
    })
  }, [imageDirectoryList, selectedImages])

  const handleShareSelectedImages = async () => {
    const imagesToShare = filterImagesById()

    const shareOptions = {
      failOnCancel: false,
      title: 'Electra share images via',
      urls: imagesToShare.map(({ uri }) => uri),
    }

    try {
      return await Share.open(shareOptions)
    } catch (error) {
      console.error('Error sharing image response in handleShareSelectedImages:', error)
    }
  }

  const handleDeleteSelectedImages = () => {
    try {
      const imagesToDelete = filterImagesById()

      const getPluralSuffix = (): string => {
        if (imagesToDelete.length > 1) {
          return 's'
        }

        return ''
      }

      const showAlertOptions = {
        cancelable: true,
        cancelText: t('actions.cancel'),
        onPressText: t('gallery.show_alert_delete_image_delete'),
        title: `${t('gallery.show_alert_delete_image_title')}${getPluralSuffix()}`,
        message: `${t('gallery.show_alert_delete_image_message')}${getPluralSuffix()}?`,
        onPress: async () => {
          try {
            const deleteImages = imagesToDelete.map(({ uri }) => {
              return RNFS.unlink(uri.replace('file://', ''))
            })

            await Promise.all(deleteImages)

            const updatedImageList = imageDirectoryList.filter(({ id }) => {
              return !selectedImages.includes(id)
            })

            setDirectoryImageList(updatedImageList)
            setSelectedImages([])
            setIsSelectionMode(false)
            setIsToggleOptionsDots(false)
          } catch (error) {
            console.error(
              'Error during deleting images in alert handleDeleteSelectedImages:',
              error
            )
          }
        },
      }

      return showAlert(showAlertOptions)
    } catch (error) {
      console.error(
        'Error during deleting images in global handleDeleteSelectedImages:',
        error
      )
    }
  }

  const handleOpenImageModal = ({ uri }: { uri: string }) => {
    setOpenedImageURI(uri)
    return setIsOpenedImageModalVisible(true)
  }

  const handleCloseImageModal = () => {
    setIsOpenedImageModalVisible(false)
    return setOpenedImageURI(undefined)
  }

  const renderItem = ({ item }: { item: IImageList }) => {
    const { id, date, uri } = item

    const isSelected = selectedImages.includes(id)
    const formattedDate = format(date, 'dd.MM.yyyy')

    const handlePress = () => {
      if (isSelectionMode) {
        return handleSelectImage({ id, date: formattedDate })
      }

      return handleOpenImageModal({ uri })
    }

    const handleOnLongPress = () => {
      if (!isSelectionMode) {
        setIsSelectionMode(true)
        setIsToggleOptionsDots(true)
      }

      return handleSelectImage({ id, date: formattedDate })
    }

    return (
      <Button
        flex={1}
        onPress={handlePress}
        onLongPress={handleOnLongPress}
        backgroundColor="graphite_to_pearl"
        style={({ pressed }) => [pressed && { opacity: 0.7 }]}
      >
        {isSelectionMode && (
          <Box position="absolute" top={4} left={4} zIndex={9}>
            <CheckBox
              borderWidth={2}
              borderRadius={10}
              borderColor="cerulean"
              defaultChecked={isSelected}
              checkIconColor="charcoal_to_white"
              bg={isSelected ? 'cerulean' : 'transparent'}
              onPressCheckbox={() => handleSelectImage({ id, date: formattedDate })}
            />
          </Box>
        )}

        <Image
          source={{ uri }}
          resizeMode="cover"
          style={{
            flex: 1,
            height: 120,
            borderRadius: isSelected ? 10 : 0,
            transform: [{ scale: isSelected ? 0.9 : 1 }],
          }}
        />
      </Button>
    )
  }

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

      <Box px="md" mt="lg" mb="xs">
        <Text variant="font24Bold" color="secondary" textAlign="center">
          {t('gallery.gallery')}
        </Text>
      </Box>

      {!imageDirectoryList.length ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Text px="md" variant="font24Bold" color="secondary" textAlign="center">
            {t('gallery.no_images_saved')}
          </Text>
        </Box>
      ) : (
        <React.Fragment>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {Object.keys(groupedImagesByDate).map((date, index) => {
              return (
                <Box key={index} mx="md">
                  <Box
                    alignItems="center"
                    flexDirection="row"
                    justifyContent="space-between"
                  >
                    <Box mb="xs">
                      <Text variant="font14Regular" color="slate_to_charcoal">
                        {t('gallery.front_door')}
                      </Text>

                      <Text variant="font14Regular" color="slate_to_charcoal">
                        {date}
                      </Text>
                    </Box>

                    <Box flexDirection="row" alignItems="center">
                      {isToggleOptionsDots && (
                        <Box mr="sm">
                          <CheckBox
                            borderWidth={2}
                            bg="transparent"
                            borderRadius={10}
                            borderColor="silver"
                            checkIconColor="silver"
                            defaultChecked={selectedDates.includes(date)}
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            onPressCheckbox={() => handleSelectAllImagesForDate({ date })}
                          />
                        </Box>
                      )}

                      <Button
                        width={24}
                        height={24}
                        alignItems="center"
                        justifyContent="center"
                        onPress={handleOptionsDots}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      >
                        <ThemeIcon icon="MenuDotsIcon" />
                      </Button>
                    </Box>
                  </Box>

                  <FlatList
                    numColumns={2}
                    scrollEnabled={false}
                    renderItem={renderItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    columnWrapperStyle={{ gap: 7 }}
                    data={groupedImagesByDate[date]}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 7 }}
                  />

                  <Divider color="graphite_to_silverstone" my="md" />
                </Box>
              )
            })}
          </ScrollView>

          {isSelectionMode && !!selectedImages.length && (
            <Box flexDirection="row" my="sm" mx="sm">
              <Button
                width={63}
                height={60}
                elevation={4}
                shadowRadius={4}
                alignItems="center"
                shadowColor="black"
                shadowOpacity={0.2}
                bg="charcoal_to_ivory"
                justifyContent="center"
                onPress={handleShareSelectedImages}
                shadowOffset={{ width: 4, height: 4 }}
              >
                <ThemeIcon icon="ShareIcon" color="silverstone_to_steel" />

                <Text
                  textAlign="center"
                  variant="font14Regular"
                  color="silverstone_to_steel"
                >
                  {t('actions.share')}
                </Text>
              </Button>

              <Button
                ml="sm"
                width={63}
                height={60}
                elevation={4}
                shadowRadius={4}
                alignItems="center"
                shadowColor="black"
                shadowOpacity={0.2}
                bg="charcoal_to_ivory"
                justifyContent="center"
                onPress={handleDeleteSelectedImages}
                shadowOffset={{ width: 4, height: 4 }}
              >
                <ThemeIcon icon="DeleteIcon" color="silverstone_to_steel" />

                <Text
                  textAlign="center"
                  variant="font14Regular"
                  color="silverstone_to_steel"
                >
                  {t('actions.delete')}
                </Text>
              </Button>
            </Box>
          )}
        </React.Fragment>
      )}

      <Modal
        transparent
        animationType="fade"
        statusBarTranslucent
        visible={isOpenedImageModalVisible}
      >
        <Box flex={1} justifyContent="center" backgroundColor="white_05_to_black_05">
          <Image
            resizeMode="contain"
            style={{ height: WIDTH, width: WIDTH }}
            source={{ priority: 'high', uri: openedImageURI }}
          />

          <Button
            mr="xs"
            borderRadius={8}
            alignItems="center"
            justifyContent="center"
            onPress={handleCloseImageModal}
          >
            <Text variant="font16SemiBold" color="secondary">
              {t('actions.close')}
            </Text>
          </Button>
        </Box>
      </Modal>
    </Screen>
  )
}

export default GalleryScreen
