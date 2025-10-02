import type { AppleRequestResponseFullName } from '@invertase/react-native-apple-authentication'

interface IFullName {
  appleFullNameObj?: Partial<AppleRequestResponseFullName> | null
}

export const getAppleFullName = (fullName: IFullName): string => {
  const { appleFullNameObj } = fullName
  return Object.values(appleFullNameObj ?? {}).find((namePart) => namePart) || ''
}
