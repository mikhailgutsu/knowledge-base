interface IValidateEmail {
  email: string
  validEmail: string
  emailCannotBeEmpty: string
}

export const validateEmail = (props: IValidateEmail) => {
  const { email, emailCannotBeEmpty, validEmail } = props

  const re = /\S+@\S+\.\S+/

  if (!email || email.length <= 0) return emailCannotBeEmpty
  if (!re.test(email)) return validEmail
  return ''
}
