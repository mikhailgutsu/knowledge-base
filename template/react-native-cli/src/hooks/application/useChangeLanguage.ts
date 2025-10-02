import i18n from '@translations/config'

import { changeLanguage } from 'i18next'
import { setStorageItem } from '@storage'

import { FALLBACK_LOCALE } from '@translations/constants'

import type { SupportedLocales } from '@translations/types'

const LANGUAGES = {
  ro: '🇲🇩 Română',
  en: '🇺🇸 English',
  // de: '🇩🇪 Deutsch',
  // fr: '🇫🇷 Français',
  // es: '🇪🇸 Español',
}

const useChangeLanguage = () => {
  const handleChangeLanguage = async (selectedLabel: SupportedLocales) => {
    const selectedLanguageCode = Object.keys(LANGUAGES).find((key) => {
      return LANGUAGES[key as SupportedLocales] === selectedLabel
    })

    if (selectedLanguageCode) {
      await setStorageItem('lng', selectedLanguageCode)
      return await changeLanguage(selectedLanguageCode)
    }
  }

  const selectedLanguage = LANGUAGES[i18n.language as SupportedLocales] ?? FALLBACK_LOCALE

  const languages = Object.values(LANGUAGES)

  return {
    languages,
    selectedLanguage,
    handleChangeLanguage,
  }
}

export default useChangeLanguage
