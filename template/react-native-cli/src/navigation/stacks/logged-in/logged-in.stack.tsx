import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator, type DrawerScreenProps } from '@react-navigation/drawer'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import { useAppResumeSinginX1 } from '@hooks'
import { useNavigation } from '@react-navigation/native'

import * as LOGGED_IN_SCREEN from '@screens/logged-in'
import CustomDrawerContent from '@navigation/stacks/logged-in/logged-in.custom.drawer'

import { WIDTH } from 'src/constants'

import {
  LOGGED_IN_SCREENS,
  type LoggedInStackParamList,
  type LoggedInDrawerParamList,
  type LoggedInHomeStackParamList,
} from './logged-in.types'

const Drawer = createDrawerNavigator<LoggedInDrawerParamList>()



const Stack = createNativeStackNavigator<LoggedInStackParamList>()



export default LoggedInStack
