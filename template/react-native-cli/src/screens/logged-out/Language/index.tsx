import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useChangeLanguage } from '@hooks'
import { useTranslation } from 'react-i18next'

import { Box, Screen, Text, Dropdown } from '@components/atoms'

import { WIDTH } from 'src/constants'

const LanguageScreen: React.FC = () => {
  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'light-content' : 'dark-content'

  const { languages, selectedLanguage, handleChangeLanguage } = useChangeLanguage()

  return (
    <Screen
      width={WIDTH}
      bg="charcoal_to_white"
      statusColor="charcoal_to_white"
      statusBarStyle={statusBarStyle}
    >
      <Box px="md">
        <Box mb="lg" my="lg">
          <Text variant="font28Bold" textAlign="center" color="secondary">
            {t('slides.uppercase_select_language')}
          </Text>
        </Box>

        <Dropdown
          data={languages}
          defaultValue={selectedLanguage}
          onChange={handleChangeLanguage}
        />
      </Box>
    </Screen>
  )
}

export default LanguageScreen
