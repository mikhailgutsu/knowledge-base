import React from 'react'
import { t } from 'i18next'
import { BlurView } from '@react-native-community/blur'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { useSelector } from 'react-redux'
import { selectInternetState } from '@store/internetState/internetState.selectors'

import { Box, Text } from '@components/atoms'

export const NoInternetOverlay: React.FC = () => {
  const internetState = useSelector(selectInternetState)

  const [isChecking, setIsChecking] = React.useState<boolean>(true)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsChecking(false)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [internetState])

  return (
    <Box
      top={0}
      left={0}
      right={0}
      bottom={0}
      position="absolute"
      alignItems="center"
      justifyContent="center"
    >
      <BlurView
        blurAmount={3}
        blurType="dark" // 'xlight', 'light', 'dark'
        style={styles.blurView}
        reducedTransparencyFallbackColor="black"
      />
      {isChecking ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <Text color="white" p="lg">
          {t('dashBoard.no_internet')}
        </Text>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  blurView: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
})
