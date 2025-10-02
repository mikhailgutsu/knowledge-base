import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import * as LOGGED_OUT_SCREEN from '@screens/logged-out'

import { LOGGED_OUT_SCREENS, type LoggedOutStackParamList } from './logged-out.types'

const Stack = createNativeStackNavigator<LoggedOutStackParamList>()



export default LoggedOutStack
