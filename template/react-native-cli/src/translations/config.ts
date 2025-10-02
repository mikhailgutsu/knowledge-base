import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'

import { GLOBAL } from './translation'
import { FALLBACK_LOCALE, SUPPORTED_LOCALES } from './constants'

import { getStorageItem } from '@storage'

import type { SupportedLocales } from './types'

const initializeI18n = async () => {
  const lng =
    (await getStorageItem<SupportedLocales>('lng')) ??
    (SUPPORTED_LOCALES.includes(
      RNLocalize.getLocales()[0].languageCode as SupportedLocales
    )
      ? RNLocalize.getLocales()[0].languageCode
      : FALLBACK_LOCALE)

  i18n.use(initReactI18next).init({
    lng,
    fallbackLng: FALLBACK_LOCALE,
    react: { useSuspense: false },
    debug: __DEV__ ? true : false,
    supportedLngs: SUPPORTED_LOCALES,
    interpolation: { escapeValue: false },
    resources: {
      ro: { translation: GLOBAL.ro },
      en: { translation: GLOBAL.en },
      // de: { translation: GLOBAL.de },
      // fr: { translation: GLOBAL.fr },
      // es: { translation: GLOBAL.es },
    },
  })
}

initializeI18n()

export default i18n
