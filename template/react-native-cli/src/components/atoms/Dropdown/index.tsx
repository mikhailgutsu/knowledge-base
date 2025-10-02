import React from 'react'
import SelectDropdown from 'react-native-select-dropdown'

import useStyles from './Dropdown.styles'

import { Box, Text, ThemeIcon } from '@components/atoms'

interface IDropdown<T extends any> {
  data: T[]
  defaultValue?: T
  onChange?(arg: T, index: number): void
}

const Dropdown = <T extends any>(props: IDropdown<T>) => {
  const { data, onChange, defaultValue } = props

  const [isOpened, setIsOpened] = React.useState(false)

  const styles = useStyles({ isOpened })

  return (
    <SelectDropdown
      data={data}
      rowStyle={styles.rowStyle}
      defaultValue={defaultValue}
      buttonStyle={styles.buttonStyle}
      onBlur={() => setIsOpened(false)}
      onFocus={() => setIsOpened(true)}
      dropdownOverlayColor="transparent"
      rowTextStyle={styles.rowTextStyle}
      dropdownStyle={styles.dropdownStyle}
      rowTextForSelection={(item) => item}
      buttonTextStyle={styles.buttonTextStyle}
      selectedRowStyle={styles.selectedRowStyle}
      selectedRowTextStyle={styles.selectedRowTextStyle}
      buttonTextAfterSelection={(selectedItem) => selectedItem}
      onSelect={(selectedItem, index) => onChange?.(selectedItem, index)}
      renderCustomizedButtonChild={(item) => {
        const [countryFlag, language] = item?.split(' ') ?? []

        return (
          <Box
            flex={1}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text variant="font16SemiBold" color="secondary">
              {countryFlag}
            </Text>
            <Text variant="font14SemiBold" color="secondary">
              {language}
            </Text>

            <ThemeIcon
              color={isOpened ? 'cerulean' : 'ivory_to_charcoal'}
              icon={isOpened ? 'ChevronTopIcon' : 'ChevronBottomIcon'}
            />
          </Box>
        )
      }}
      renderCustomizedRowChild={(item) => {
        const [countryFlag, language] = item?.split(' ') ?? []

        return (
          <Box
            flex={1}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text variant="font14SemiBold" color="secondary">
              {countryFlag}
            </Text>

            <Text variant="font14SemiBold" color="secondary">
              {language}
            </Text>

            <Box width={24} height={24} />
          </Box>
        )
      }}
    />
  )
}

export default Dropdown
