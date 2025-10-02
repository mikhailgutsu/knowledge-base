import React from 'react'

import { useTheme } from '@theme/useTheme'
import { useTranslation } from 'react-i18next'
import { validateEmail } from '@helpers/index'
import { useUserInvitation } from 'src/hooks/user-management'

import {
  Box,
  Text,
  Input,
  Screen,
  Loader,
  Button,
  ThemeIcon,
  ScrollView,
} from '@components/atoms'

import { INVITATION_INPUT_MAX_CHARS_LENGTH } from 'src/constants'

import type { LoggedInStackScreenProps } from '@navigation/stacks/logged-in/logged-in.types'

interface IUserGroup {
  email: string
  serialNumber: string
  role: 'DEVICE_OWNER' | 'DEVICE_VIEWER'
}

const InvitationViaEmail: React.FC<LoggedInStackScreenProps<'InvitationViaEmail'>> = (
  props
) => {
  const { navigation, route } = props

  const device = route.params.device

  const { t } = useTranslation()

  const { isDarkTheme } = useTheme()
  const statusBarStyle = isDarkTheme ? 'dark-content' : 'light-content'

  const [email, setEmail] = React.useState({ value: '', error: '' })
  const [message, setMessage] = React.useState({ value: '', error: '' })

  const { loadingUserInvitation, fetchUserInvitation } = useUserInvitation()

  const handleSendInvitation = async () => {
    const emailValidation = validateEmail({
      email: email.value,
      validEmail: t('register.email_is_not_valid'),
      emailCannotBeEmpty: t('register.email_cant_be_empty'),
    })

    if (emailValidation) {
      setEmail({ ...email, error: emailValidation })
      return
    }

    if (!message.value || message.value.length < 5) {
      setMessage({
        ...message,
        error: t('invitationViaEmail.enter_message'),
      })
      return
    }

    const invitationData: IUserGroup = {
      email: email.value,
      role: 'DEVICE_VIEWER',
      serialNumber: device.serialNumber,
    }
    await fetchUserInvitation(invitationData)

    navigation.goBack()
  }

  const handleChange = (text: string) => {
    if (text.length <= INVITATION_INPUT_MAX_CHARS_LENGTH) {
      setMessage({ value: text, error: '' })
    }
  }

  return (
    <Screen
      bg="charcoal_to_white"
      statusColor="white_to_charcoal"
      statusBarStyle={statusBarStyle}
    >
      <Box height={56} alignItems="center" bg="ivory_to_charcoal" justifyContent="center">
        <Button
          left={10}
          width={30}
          height={56}
          position="absolute"
          alignItems="center"
          justifyContent="center"
          onPress={navigation.goBack}
        >
          <ThemeIcon icon="ChevronLeftIcon" color="charcoal_to_ivory" />
        </Button>

        <ThemeIcon width={156} height={23} icon="ElectraIcon" color="charcoal_to_ivory" />
      </Box>

      <ScrollView
        px="md"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <Box mt="lg" px="xl">
          <Text variant="font24Bold" textAlign="center" color="secondary">
            {t('invitationViaEmail.send_invitation_via_email')}
          </Text>
          <Text textAlign="center" variant="font14Regular" color='ivory_to_steel'>
            {t('invitationViaEmail.invitation_description')}
          </Text>
        </Box>

        <Box flex={1} justifyContent="space-between" mt="lg">
          <Box>
            <Input
              value={email.value}
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder={t('resetPassword.email')}
              onChangeText={(text) => setEmail({ value: text, error: '' })}
            />
            {email.error && (
              <Text color="error" variant="font13SemiBold">
                {email.error}
              </Text>
            )}

            <Box mt="sm">
              <Text mb="xs" variant="font16Regular" color="slate_to_charcoal">
                {t('invitationViaEmail.message_optional')}
              </Text>

              <Box>
                <Input
                  multiline
                  height={120}
                  value={message.value}
                  textAlignVertical="top"
                  onChangeText={handleChange}
                  maxLength={INVITATION_INPUT_MAX_CHARS_LENGTH}
                  placeholder={t('invitationViaEmail.placeholder_enter_message')}
                />

                <Box position="absolute" bottom={0} padding="xs" right={0}>
                  <Text textAlign="right" variant="font14Regular">
                    {message.value.length} / {INVITATION_INPUT_MAX_CHARS_LENGTH}
                  </Text>
                </Box>
              </Box>

              {message.error && (
                <Text color="error" variant="font13SemiBold">
                  {message.error}
                </Text>
              )}
            </Box>
          </Box>

          <Box>
            <Button
              mt="sm"
              mb="md"
              height={48}
              bg="cerulean"
              alignItems="center"
              justifyContent="center"
              onPress={handleSendInvitation}
              disabled={loadingUserInvitation}
            >
              <Text variant="font16Regular" color="white">
                {t('invitationViaEmail.send')}
              </Text>
              <Loader loading={loadingUserInvitation} />
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </Screen>
  )
}

export default InvitationViaEmail
