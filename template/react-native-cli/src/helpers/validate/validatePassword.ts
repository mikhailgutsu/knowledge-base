interface PasswordValidation {
  hasMinLength: boolean
  hasNumberOrSymbol: boolean
  hasUpperAndLowerCase: boolean
}

interface IValidatePassword {
  password: string
  passwordCannotBeEmpty: string
}

export const validatePassword = (
  props: IValidatePassword
): string | PasswordValidation => {
  const { password, passwordCannotBeEmpty } = props

  if (!password || password.length <= 0) {
    return passwordCannotBeEmpty
  }

  return {
    hasMinLength: password.length >= 8,
    hasNumberOrSymbol: /[0-9!@#$%^&*]/.test(password),
    hasUpperAndLowerCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
  }
}
