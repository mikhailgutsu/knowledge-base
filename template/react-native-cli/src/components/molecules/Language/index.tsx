import React from 'react'

import { useChangeLanguage } from '@hooks'
import { useTranslation } from 'react-i18next'

import { Box, Text, Dropdown } from '@components/atoms'

import { WIDTH } from 'src/constants'

const LanguageMolecule: React.FC = () => {
  const { t } = useTranslation()

  const { languages, selectedLanguage, handleChangeLanguage } = useChangeLanguage()

  return (
    <Box px="md" width={WIDTH}>
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
  )
}

export default LanguageMolecule
